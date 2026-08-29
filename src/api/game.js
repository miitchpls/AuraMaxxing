// Tier 2. The game's state lives on page objects a content script cannot see,
// so this talks to src/world/gameBridge.js running in the page world. It is the
// only part of the extension that depends on the game's internals, and the only
// one expected to break when the game changes.
const REQUEST = "auramaxxing:game-request";
const RESPONSE = "auramaxxing:game-response";
const TIMEOUT_MS = 2000;

const UNIT_TYPES = {
  buildCity: "City",
  buildFactory: "Factory",
  buildPort: "Port",
  buildDefensePost: "Defense Post",
  buildMissileSilo: "Missile Silo",
  buildSamLauncher: "SAM Launcher",
  buildWarship: "Warship",
  buildAtomBomb: "Atom Bomb",
  buildHydrogenBomb: "Hydrogen Bomb",
  buildMIRV: "MIRV",
};

let lastId = 0;

export const available = () =>
  document.documentElement.dataset.auramaxxingBridge === "1";

export const inspect = (x, y, action) =>
  new Promise((resolve) => {
    const id = ++lastId;
    const onResponse = (event) => {
      const data = JSON.parse(event.detail);
      if (data.id !== id) return;
      done(data);
    };
    const timer = setTimeout(() => done({ ready: false }), TIMEOUT_MS);
    const done = (data) => {
      clearTimeout(timer);
      window.removeEventListener(RESPONSE, onResponse);
      resolve(data);
    };
    window.addEventListener(RESPONSE, onResponse);
    window.dispatchEvent(
      new CustomEvent(REQUEST, {
        detail: JSON.stringify({
          id,
          screenX: x,
          screenY: y,
          unitType: UNIT_TYPES[action],
        }),
      }),
    );
  });
