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

// The testing flow in AGENTS.md runs two clients at once — the installed
// extension and a copy loaded from the dev server — and the bridge echoes ids
// back verbatim, so a bare counter would let one client consume the other's
// reply. The prefix makes each client's ids its own.
const CLIENT = Math.random().toString(36).slice(2, 10);
let lastId = 0;

export const available = () =>
  document.documentElement.dataset.auramaxxingBridge === "1";

const ask = (payload) =>
  new Promise((resolve) => {
    const id = `${CLIENT}-${++lastId}`;
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

export const inspect = (x, y, action, count = 1) =>
  ask({
    kind: "inspect",
    screenX: x,
    screenY: y,
    unitType: UNIT_TYPES[action],
    count,
  });

const DOUBLING = new Map([
  ["City", 1000000n],
  ["Factory", 1000000n],
  ["Port", 1000000n],
]);
const STEPPING = new Map([
  ["Defense Post", { step: 50000n, cap: 250000n }],
  ["SAM Launcher", { step: 1500000n, cap: 3000000n }],
  ["Warship", { step: 250000n, cap: 1000000n }],
  ["MIRV", { step: 15000000n }],
]);

export const projectCost = (unitType, base, count) => {
  let price = base;
  let total = 0n;
  for (let i = 0; i < count; i++) {
    total += price;
    const doublingCap = DOUBLING.get(unitType);
    const stepping = STEPPING.get(unitType);
    if (doublingCap !== undefined) {
      const next = price * 2n;
      price = next > doublingCap ? doublingCap : next;
    } else if (stepping !== undefined) {
      const next = price + stepping.step;
      price =
        stepping.cap !== undefined && next > stepping.cap
          ? stepping.cap
          : next;
    }
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
