import { available as settingsAvailable, keybinds } from "./settings.js";

const DEFAULT_BINDINGS = {
  buildCity: "Digit1",
  buildFactory: "Digit2",
  buildPort: "Digit3",
  buildDefensePost: "Digit4",
  buildMissileSilo: "Digit5",
  buildSamLauncher: "Digit6",
  buildWarship: "Digit7",
  buildAtomBomb: "Digit8",
  buildHydrogenBomb: "Digit9",
  buildMIRV: "Digit0",
};

export const BUILD_ACTIONS = Object.keys(DEFAULT_BINDINGS);

export const available = () => settingsAvailable();

const binding = (action) => {
  const stored = keybinds()[action];
  const value = stored?.value ?? (Array.isArray(stored) ? stored[0] : stored);
  if (typeof value === "string" && value !== "Null") return value;
  return DEFAULT_BINDINGS[action];
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

export const confirmBuild = () => sendKey("keydown", "Enter", false);

// The game tracks the cursor through mousemove events that report movement, and
// confirms a structure wherever it last saw it — this is what lets us build at a
// fixed point without holding the real mouse there.
export const moveCursorTo = (x, y) =>
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
