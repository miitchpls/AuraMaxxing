import { BUILDABLES } from "./buildables.js";
import { keybinds, available as settingsAvailable } from "./settings.js";

export const available = () => settingsAvailable();

const binding = (action) => {
  const stored = keybinds()[action];
  const value = stored?.value ?? (Array.isArray(stored) ? stored[0] : stored);
  if (value === "Null") return undefined;
  if (typeof value === "string") return value;
  return BUILDABLES[action]?.key;
};

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
