import {
  BUILD_ACTIONS,
  DRAG_THRESHOLD_PX,
  pinCursor,
  pressBuildKey,
  pressEscape,
  releasePointer,
} from "../api/input.js";
import { inspect, quote } from "../api/game.js";
import { confirmBuild } from "../api/intents.js";
import { addSection } from "../ui/panel.js";

const LABELS = {
  buildCity: "City",
  buildFactory: "Factory",
  buildPort: "Port",
  buildDefensePost: "Defense post",
  buildMissileSilo: "Missile silo",
  buildSamLauncher: "SAM launcher",
  buildWarship: "Warship",
  buildAtomBomb: "Atom bomb",
  buildHydrogenBomb: "Hydrogen bomb",
  buildMIRV: "MIRV",
};

// Pressing a build key twice sets the game's x5 multiplier, which batches five
// actions into one intent and so hits the server rate limit five times less
// often. The game only honours it on the upgrade path (upgradable structures)
// and, when building, for the atom bomb alone — everywhere else it is ignored.
const BATCHABLE_ON_UPGRADE = new Set([
  "buildCity",
  "buildFactory",
  "buildPort",
  "buildMissileSilo",
  "buildSamLauncher",
]);
const BATCHABLE_ON_BUILD = new Set(["buildAtomBomb"]);
const BATCH_SIZE = 5;

const KEY_DELAY_MS = 100;
const BUILD_DELAY_MS = 300;
const POLL_INTERVAL_MS = 500;
// Gold accrues while the panel sits idle, so the price and the button's enabled
// state are refreshed on a slow timer rather than only when a field changes.
const COST_REFRESH_MS = 2000;
const POLL_TIMEOUT_MS = 60000;

const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(done, ms);
    const onAbort = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
      reject(signal.reason);
    };
    function done() {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });

export const parseCount = (value) => {
  const count = Number(value);
  return Number.isSafeInteger(count) && count >= 1 ? count : null;
};

const chunk = (count) => [
  ...Array(Math.floor(count / BATCH_SIZE)).fill(BATCH_SIZE),
  ...Array(count % BATCH_SIZE).fill(1),
];

export const planBatches = (action, count, firstIsBuild) => {
  if (BATCHABLE_ON_BUILD.has(action)) return chunk(count);
  if (!BATCHABLE_ON_UPGRADE.has(action)) return Array(count).fill(1);
  // A build ignores the multiplier, so only the upgrades that follow batch.
  return firstIsBuild ? [1, ...chunk(count - 1)] : chunk(count);
};

// Only the confirm reaches the server; the key presses stay in the client. So
// the batch queues at the tunnel once, right at the end, never as a whole.
const runBatch = async (action, size, x, y, signal, onWait) => {
  if (signal.aborted) throw signal.reason;
  pressEscape();
  await wait(KEY_DELAY_MS, signal);
  if (!pressBuildKey(action)) throw new Error("Build key is unbound");
  if (size === BATCH_SIZE) {
    await wait(KEY_DELAY_MS, signal);
    if (!pressBuildKey(action)) throw new Error("Build key is unbound");
  }
  await wait(KEY_DELAY_MS, signal);
  await confirmBuild("buildMaxxing", { signal, onWait });
  await wait(BUILD_DELAY_MS, signal);
};

export const batchAffordable = (state, action, size) =>
  state.batchCost !== null &&
  state.batchCost !== undefined &&
  BigInt(state.gold) >= BigInt(state.batchCost) &&
  (action !== "buildAtomBomb" || state.readyMissiles >= size);

// A structure cannot be upgraded while it is still under construction, and gold
// may not have caught up yet, so wait for the game to say the next batch is
// actually possible instead of firing into a refusal.
const waitUntilAffordable = async (point, action, size, signal) => {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (!signal.aborted) {
    const state = await inspect(point.x, point.y, action, size);
    if (signal.aborted) throw signal.reason;
    if (!state.ready || !state.valid) return { blocked: "game not ready" };
    if (state.canBuild || state.canUpgrade) {
      if (state.batchCost === null || state.batchCost === undefined) {
        return { blocked: "price unavailable" };
      }
      if (batchAffordable(state, action, size)) return {};
      if (Date.now() > deadline) {
        return {
          blocked:
            BigInt(state.gold) < BigInt(state.batchCost)
              ? "not enough gold"
              : "not enough ready missiles",
        };
      }
    } else if (Date.now() > deadline) {
      return { blocked: "target not buildable" };
    }
    await wait(POLL_INTERVAL_MS, signal);
  }
  return { blocked: "cancelled" };
};

// Resolves on a click, never on a drag: a press-and-drag has to reach the game
// so the map still pans while we are waiting for the target.
const captureNextClick = (signal, ignoredRoot) =>
  new Promise((resolve, reject) => {
    let down = null;

    const onDown = (event) => {
      if (ignoredRoot?.contains(event.target)) {
        down = null;
        return;
      }
      down = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
    };

    const onUp = (event) => {
      if (
        down === null ||
        down.pointerId !== event.pointerId ||
        ignoredRoot?.contains(event.target)
      ) {
        down = null;
        return;
      }
      const moved =
        Math.abs(event.clientX - down.x) + Math.abs(event.clientY - down.y);
      const start = down;
      down = null;
      if (moved >= DRAG_THRESHOLD_PX) return;

      event.preventDefault();
      event.stopPropagation();
      window.addEventListener(
        "click",
        (click) => {
          click.preventDefault();
          click.stopPropagation();
        },
        { capture: true, once: true },
      );
      stop();
      releasePointer(event.pointerId, start.x, start.y);
      resolve({ x: event.clientX, y: event.clientY });
    };

    const stop = () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointerup", onUp, true);
      signal.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      stop();
      reject(signal.reason);
    };

    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    signal.addEventListener("abort", onAbort, { once: true });
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointerup", onUp, true);
  });

const buildBody = () => {
  const body = document.createElement("div");
  body.className = "flex flex-col gap-2 text-sm";
  body.innerHTML = `
    <select class="w-full px-1 py-1 bg-gray-700/50 border border-slate-500 rounded-md text-white" data-entity>
      ${BUILD_ACTIONS.map(
        (action) => `<option value="${action}">${LABELS[action]}</option>`,
      ).join("")}
    </select>
    <input type="number" min="1" step="1" value="10"
      class="w-full px-1 py-1 bg-gray-700/50 border border-slate-500 rounded-md text-white" data-count />
    <button class="w-full px-1 py-1 cursor-pointer bg-gray-700/50 hover:bg-gray-600 border border-slate-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" data-run>
      Activate
    </button>
    <span class="text-xs text-slate-400" data-cost></span>
    <span class="text-xs text-slate-400" data-status>Idle</span>`;
  return body;
};

const formatGold = (amount) => {
  if (amount >= 1_000_000n) return `${Number(amount) / 1_000_000}M`;
  if (amount >= 1_000n) return `${Number(amount) / 1_000}K`;
  return `${amount}`;
};

const showCost = async (body) => {
  const label = body.querySelector("[data-cost]");
  const button = body.querySelector("[data-run]");
  const action = body.querySelector("[data-entity]").value;
  const count = parseCount(body.querySelector("[data-count]").value);

  if (activeRun !== null) return;
  if (count === null) {
    label.textContent = "Count must be a whole number of at least 1";
    label.classList.add("text-red-400");
    label.classList.remove("text-slate-400");
    button.disabled = true;
    return;
  }

  const price = await quote(action, count);

  // A run in progress owns the button; it reads Cancel and must stay clickable.
  if (activeRun !== null) return;

  if (!price.ready) {
    label.textContent = "";
    button.disabled = false;
    return;
  }

  const total = BigInt(price.total);
  const affordable = BigInt(price.gold) >= total;
  const shown = `${price.exact ? "" : "~"}${formatGold(total)}`;
  label.textContent = affordable
    ? `Cost: ${shown}`
    : `Cost: ${shown} — you have ${formatGold(BigInt(price.gold))}`;
  label.classList.toggle("text-red-400", !affordable);
  label.classList.toggle("text-slate-400", affordable);
  button.disabled = !affordable;
};

let removeSection = null;
let costTimer = null;
let activeRun = null;

const refreshCost = (body) => {
  showCost(body).catch(() => {
    if (activeRun !== null) return;
    body.querySelector("[data-cost]").textContent = "Cost unavailable";
    body.querySelector("[data-run]").disabled = false;
  });
};

const cancelActiveRun = (body) => {
  const run = activeRun;
  if (run === null) return;
  activeRun = null;
  run.controller.abort();
  body.querySelector("[data-run]").textContent = "Activate";
  body.querySelector("[data-status]").textContent = "Idle";
  refreshCost(body);
};

const start = async (body) => {
  const action = body.querySelector("[data-entity]").value;
  const count = parseCount(body.querySelector("[data-count]").value);
  const status = body.querySelector("[data-status]");
  const button = body.querySelector("[data-run]");

  if (count === null) {
    status.textContent = "Count must be a whole number of at least 1";
    refreshCost(body);
    return;
  }

  const run = { controller: new AbortController() };
  const signal = run.controller.signal;
  activeRun = run;
  button.textContent = "Cancel";
  status.textContent = "Click the target tile";

  let release = null;
  try {
    const point = await captureNextClick(
      signal,
      body.closest("#auramaxxing-panel"),
    );

    const target = await inspect(point.x, point.y, action);
    if (signal.aborted) return;
    if (!target.ready) {
      status.textContent = "No game running";
    } else if (!target.valid || (!target.canBuild && !target.canUpgrade)) {
      status.textContent = `Cannot place ${LABELS[action]} there`;
    } else {
      release = pinCursor(point.x, point.y);
      const batches = planBatches(action, count, !target.canUpgrade);
      let done = 0;
      for (const size of batches) {
        if (signal.aborted) break;
        const { blocked } = await waitUntilAffordable(
          point,
          action,
          size,
          signal,
        );
        if (blocked) {
          status.textContent = `Stopped at ${done}: ${blocked}`;
          break;
        }
        await runBatch(action, size, point.x, point.y, signal, () => {
          status.textContent = `${done}/${count} — pacing`;
        });
        done += size;
        status.textContent = `${done}/${count}`;
      }
      if (done >= count) status.textContent = "Done";
    }
  } catch (error) {
    if (!signal.aborted && activeRun === run) {
      status.textContent = error instanceof Error ? error.message : "Build failed";
      console.error("[AuraMaxxing] buildMaxxing run failed", error);
    }
  } finally {
    release?.();
    if (activeRun === run) {
      activeRun = null;
      button.textContent = "Activate";
      refreshCost(body);
    }
  }
};

export default {
  id: "buildMaxxing",
  name: "buildMaxxing",
  requires: ["dom", "game", "input", "intents"],

  enable() {
    const body = buildBody();
    for (const field of ["[data-entity]", "[data-count]"]) {
      body.querySelector(field).addEventListener("change", () => refreshCost(body));
    }
    refreshCost(body);
    costTimer = setInterval(() => refreshCost(body), COST_REFRESH_MS);
    body.querySelector("[data-run]").addEventListener("click", () => {
      if (activeRun !== null) {
        cancelActiveRun(body);
        return;
      }
      void start(body).catch((error) => {
        console.error("[AuraMaxxing] buildMaxxing start failed", error);
      });
    });
    removeSection = addSection({ id: "buildmaxxing", title: "BuildMaxxing", body });
  },

  disable() {
    const run = activeRun;
    activeRun = null;
    run?.controller.abort();
    clearInterval(costTimer);
    costTimer = null;
    removeSection?.();
    removeSection = null;
  },
};
