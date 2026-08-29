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

const ask = (payload) =>
  new Promise((resolve) => {
    const id = ++lastId;
    const kind = payload.kind ?? "inspect";
    const onResponse = (event) => {
      const data = JSON.parse(event.detail);
      if (data.id !== id || data.kind !== kind) return;
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
      new CustomEvent(REQUEST, { detail: JSON.stringify({ id, ...payload }) }),
    );
  });

export const inspect = (x, y, action) =>
  ask({ kind: "inspect", screenX: x, screenY: y, unitType: UNIT_TYPES[action] });

// The game caps only the types whose price escalates: cities, factories and
// ports double per unit, warships step by a fixed amount, everything else is
// flat. Used when the player owns none of a type, so the game has no running
// totals to give and only the next price is known.
const PRICE_CAP = 1000000n;
const DOUBLING = new Set(["City", "Factory", "Port"]);
const STEPPING = new Map([["Warship", 250000n]]);

export const projectCost = (unitType, base, count) => {
  const capped = (next) => (next > PRICE_CAP ? PRICE_CAP : next);
  let price = base;
  let total = 0n;
  for (let i = 0; i < count; i++) {
    total += price;
    if (DOUBLING.has(unitType)) price = capped(price * 2n);
    else if (STEPPING.has(unitType)) price = capped(price + STEPPING.get(unitType));
  }
  return total;
};

export const quote = async (action, count) => {
  const unitType = UNIT_TYPES[action];
  const reply = await ask({ kind: "quote", unitType, count });
  if (!reply.ready) return reply;
  return {
    ...reply,
    total: reply.exact
      ? reply.total
      : String(projectCost(unitType, BigInt(reply.base), count)),
  };
};
