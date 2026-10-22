// Tier 2. The game's state lives on page objects a content script cannot see,
// so this talks to src/world/gameBridge.js running in the page world. It is the
// only part of the extension that depends on the game's internals, and the only
// one expected to break when the game changes.
import { BUILDABLES } from "./buildables.js";

const REQUEST = "auramaxxing:game-request";
const RESPONSE = "auramaxxing:game-response";
const TIMEOUT_MS = 2000;


// The testing flow in AGENTS.md runs two clients at once — the installed
// extension and a copy loaded from the dev server — and the bridge echoes ids
// back verbatim, so a bare counter would let one client consume the other's
// reply. The prefix makes each client's ids its own.
const CLIENT = Math.random().toString(36).slice(2, 10);
let lastId = 0;
let lastAllianceToken = 0;

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
    unitType: BUILDABLES[action].unitType,
    usesMissile: BUILDABLES[action].usesMissile === true,
    count,
  });

export const inspectWorld = (x, y, action, count = 1) =>
  ask({
    kind: "inspect",
    worldX: x,
    worldY: y,
    unitType: BUILDABLES[action].unitType,
    usesMissile: BUILDABLES[action].usesMissile === true,
    count,
  });

export const projectWorld = (x, y) =>
  ask({ kind: "project", worldX: x, worldY: y });

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
const STARTING_COST = new Map([
  ["City", 125000n],
  ["Factory", 125000n],
  ["Port", 125000n],
  ["Defense Post", 50000n],
  ["Missile Silo", 1000000n],
  ["SAM Launcher", 1500000n],
  ["Warship", 250000n],
  ["Atom Bomb", 750000n],
  ["Hydrogen Bomb", 5000000n],
  ["MIRV", 25000000n],
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

// Keeps the pre-game panel useful while no player exists for a live quote.
// Once a match is running, quote() replaces this baseline with current prices.
export const projectStartingCost = (action, count) => {
  const unitType = BUILDABLES[action].unitType;
  return projectCost(unitType, STARTING_COST.get(unitType), count);
};

export const quote = async (action, count) => {
  const unitType = BUILDABLES[action].unitType;
  const reply = await ask({ kind: "quote", unitType, count });
  if (!reply.ready) return reply;
  return {
    ...reply,
    total: reply.exact
      ? reply.total
      : String(projectCost(unitType, BigInt(reply.base), count)),
  };
};

export const sendUpgrade = (unitId, action, amount) =>
  ask({
    kind: "upgrade",
    unitId,
    unitType: BUILDABLES[action].unitType,
    amount,
  });

export const allianceActions = () => ask({ kind: "allianceState" });

export const sendAllianceAction = (action, recipient, { signal } = {}) => {
  if (signal?.aborted) return Promise.reject(signal.reason);
  const token = `${CLIENT}-alliance-${++lastAllianceToken}`;
  const onAbort = () => {
    void ask({ kind: "allianceCancel", token });
  };
  signal?.addEventListener("abort", onAbort, { once: true });
  return ask({ kind: "allianceAction", action, recipient, token }).finally(() =>
    signal?.removeEventListener("abort", onAbort),
  );
};
