import { BUILD_ACTIONS, BUILDABLES } from "./buildables.js";
import { keybinds, available as settingsAvailable } from "./settings.js";

export const available = () => settingsAvailable();

const bindingIn = (stored, action) => {
  const entry = stored[action];
  const value = entry?.value ?? (Array.isArray(entry) ? entry[0] : entry);
  if (value === "Null") return undefined;
  if (typeof value === "string") return value;
  return BUILDABLES[action]?.key;
};

const binding = (action) => bindingIn(keybinds(), action);

const sendKey = (type, code, shiftKey) =>
  window.dispatchEvent(
    new KeyboardEvent(type, { code, shiftKey, bubbles: true }),
  );

export const pressBuildKey = (action) => {
  const value = binding(action);
  if (value === undefined) return false;
  const code = value.replace("Shift+", "");
  const shiftKey = value.startsWith("Shift+");
  sendKey("keydown", code, shiftKey);
  sendKey("keyup", code, shiftKey);
  return true;
};

// The game tracks the cursor through mousemove events that report movement, and
// both validates and places a structure wherever it last saw it.
const moveCursorTo = (x, y) =>
  window.dispatchEvent(
    new MouseEvent("mousemove", {
      clientX: x,
      clientY: y,
      movementX: 1,
      movementY: 1,
      bubbles: true,
    }),
  );

// Clears any ghost structure and resets the x5 multiplier, so a batch always
// starts from a known state whatever the previous one left behind.
export const pressEscape = () => sendKey("keydown", "Escape", false);

// Holds the game's idea of the cursor at one point until released. A real mouse
// move is swallowed and replaced by ours, because the game validates the ghost
// against its last known cursor tile — letting one through retargets the build.
export const pinCursor = (x, y) => {
  const point = { x, y };
  let ours = false;
  const send = () => {
    ours = true;
    moveCursorTo(point.x, point.y);
    ours = false;
  };
  const onRealMove = (event) => {
    if (ours) return;
    event.stopPropagation();
    send();
  };
  window.addEventListener("mousemove", onRealMove, true);
  send();
  return {
    move(nextX, nextY) {
      point.x = nextX;
      point.y = nextY;
      send();
    },
    release() {
      window.removeEventListener("mousemove", onRealMove, true);
    },
  };
};

// The game reads a pointerup further than this from the press as a drag and
// skips the click action, while still clearing its pointer state.
export const DRAG_THRESHOLD_PX = 10;

// Ends a press the game must not act on. Simply swallowing the real pointerup
// would leave the game believing the button is still down, which makes the map
// pan on a bare mouse move; replaying it far away reads as a drag instead.
export const releasePointer = (pointerId, x, y) =>
  window.dispatchEvent(
    new PointerEvent("pointerup", {
      clientX: x + DRAG_THRESHOLD_PX * 10,
      clientY: y,
      pointerId,
      pointerType: "mouse",
      button: 0,
      buttons: 0,
      bubbles: true,
    }),
  );

export const pickMapPoint = ({ signal, exclude }) =>
  new Promise((resolve) => {
    let down = null;
    let finishing = false;
    const finish = (point) => {
      finishing = true;
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointerup", onUp, true);
      window.removeEventListener("keydown", onKey, true);
      signal?.removeEventListener("abort", onAbort);
      resolve(point);
    };
    const onDown = (event) => {
      if (
        event.button !== 0 ||
        (event.target?.tagName !== "CANVAS" &&
          event.target?.id !== "game-input-overlay") ||
        exclude?.contains(event.target)
      )
        return;
      down = { x: event.clientX, y: event.clientY, id: event.pointerId };
      event.stopImmediatePropagation();
      event.preventDefault();
    };
    const onUp = (event) => {
      if (finishing || !down || event.pointerId !== down.id) return;
      event.stopImmediatePropagation();
      event.preventDefault();
      const point =
        Math.hypot(event.clientX - down.x, event.clientY - down.y) <=
        DRAG_THRESHOLD_PX
          ? { x: event.clientX, y: event.clientY }
          : null;
      finish(point);
    };
    const onKey = (event) => {
      if (event.code !== "Escape") return;
      event.stopImmediatePropagation();
      finish(null);
    };
    const onAbort = () => finish(null);
    if (signal?.aborted) return finish(null);
    pressEscape();
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointerup", onUp, true);
    window.addEventListener("keydown", onKey, true);
    signal?.addEventListener("abort", onAbort, { once: true });
  });

// The same targets the game keeps its keybinds away from, the in-game keybind
// editor included.
const isTextInput = (target) => {
  if (!target) return false;
  if (typeof target.closest === "function" && target.closest("setting-keybind"))
    return true;
  if (target.tagName === "TEXTAREA" || target.isContentEditable === true)
    return true;
  return target.tagName === "INPUT" && target.type !== "range";
};

const digitOf = (code) => /^(?:Digit|Numpad)([0-9])$/.exec(code)?.[1] ?? null;

// Resolved the way the game does: an exact binding wins, then a digit matches
// its numpad twin and the other way around.
const buildActionFor = (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return null;
  const stored = keybinds();
  const bound = BUILD_ACTIONS.flatMap((action) => {
    const value = bindingIn(stored, action);
    if (value === undefined) return [];
    return [
      {
        action,
        shift: value.startsWith("Shift+"),
        code: value.replace("Shift+", ""),
      },
    ];
  }).filter(({ shift }) => shift === event.shiftKey);
  const exact = bound.find(({ code }) => code === event.code);
  if (exact) return exact.action;
  const digit = digitOf(event.code);
  if (digit === null) return null;
  return bound.find(({ code }) => digitOf(code) === digit)?.action ?? null;
};

// Takes the player's build keys away from the game and reports each press with
// the cursor position. Synthetic presses are left alone: other features drive
// the game through the same keys. A key pressed before the cursor has been seen
// has nowhere to go, and is handed back to the game.
export const captureBuildKeys = (onPress) => {
  let cursor = null;
  const held = new Set();
  const onMove = (event) => {
    cursor = { x: event.clientX, y: event.clientY };
  };
  const onKeyDown = (event) => {
    if (!event.isTrusted || cursor === null || isTextInput(event.target)) return;
    const action = buildActionFor(event);
    if (action === null) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    held.add(event.code);
    if (!event.repeat) onPress(action, cursor.x, cursor.y);
  };
  // The game acts on keyup, so the release of a captured key is swallowed
  // whatever modifiers have changed since the press.
  const onKeyUp = (event) => {
    if (held.delete(event.code)) event.stopImmediatePropagation();
  };
  window.addEventListener("pointermove", onMove, {
    capture: true,
    passive: true,
  });
  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keyup", onKeyUp, true);
  return () => {
    window.removeEventListener("pointermove", onMove, true);
    window.removeEventListener("keydown", onKeyDown, true);
    window.removeEventListener("keyup", onKeyUp, true);
  };
};
