import {
  BUILD_ACTIONS,
  confirmBuild,
  moveCursorTo,
  pressBuildKey,
  pressEscape,
} from "../api/input.js";
import { createPanel } from "../ui/panel.js";

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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const planBatches = (action, count) => {
  if (BATCHABLE_ON_BUILD.has(action)) {
    return [
      ...Array(Math.floor(count / BATCH_SIZE)).fill(BATCH_SIZE),
      ...Array(count % BATCH_SIZE).fill(1),
    ];
  }
  if (!BATCHABLE_ON_UPGRADE.has(action)) return Array(count).fill(1);

  // The first action on the locked tile builds, and a build ignores the
  // multiplier; only the upgrades that follow can be batched.
  const upgrades = count - 1;
  return [
    1,
    ...Array(Math.floor(upgrades / BATCH_SIZE)).fill(BATCH_SIZE),
    ...Array(upgrades % BATCH_SIZE).fill(1),
  ];
};

const runBatch = async (action, size, x, y) => {
  pressEscape();
  await wait(KEY_DELAY_MS);
  pressBuildKey(action);
  if (size === BATCH_SIZE) {
    await wait(KEY_DELAY_MS);
    pressBuildKey(action);
  }
  await wait(KEY_DELAY_MS);
  moveCursorTo(x, y);
  confirmBuild();
  await wait(BUILD_DELAY_MS);
};

const captureNextClick = (signal) =>
  new Promise((resolve, reject) => {
    const swallow = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    signal.addEventListener("abort", () => reject(signal.reason), {
      once: true,
    });
    window.addEventListener(
      "pointerdown",
      (event) => {
        swallow(event);
        for (const type of ["pointerup", "click"]) {
          window.addEventListener(type, swallow, {
            capture: true,
            once: true,
          });
        }
        resolve({ x: event.clientX, y: event.clientY });
      },
      { capture: true, once: true, signal },
    );
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
    <input type="number" min="1" value="10"
      class="w-full px-1 py-1 bg-gray-700/50 border border-slate-500 rounded-md text-white" data-count />
    <button class="w-full px-1 py-1 cursor-pointer bg-gray-700/50 hover:bg-gray-600 border border-slate-500 rounded-md transition-colors" data-run>
      Activate
    </button>
    <span class="text-xs text-slate-400" data-status>Idle</span>`;
  return body;
};

let panel = null;
let abort = null;

const start = async (body) => {
  const action = body.querySelector("[data-entity]").value;
  const count = Math.max(1, Number(body.querySelector("[data-count]").value));
  const status = body.querySelector("[data-status]");
  const button = body.querySelector("[data-run]");

  abort = new AbortController();
  button.textContent = "Cancel";
  status.textContent = "Click the target tile";

  let point;
  try {
    point = await captureNextClick(abort.signal);
  } catch {
    return;
  }

  const batches = planBatches(action, count);
  let done = 0;
  for (const size of batches) {
    if (abort.signal.aborted) break;
    await runBatch(action, size, point.x, point.y);
    done += size;
    status.textContent = `${done}/${count}`;
  }
  status.textContent = abort.signal.aborted ? `Stopped at ${done}` : "Done";
  button.textContent = "Activate";
  abort = null;
};

export default {
  id: "buildMaxxing",
  name: "buildMaxxing",
  requires: ["dom", "input"],

  enable() {
    const body = buildBody();
    body.querySelector("[data-run]").addEventListener("click", () => {
      if (abort) {
        abort.abort();
        abort = null;
        body.querySelector("[data-run]").textContent = "Activate";
        body.querySelector("[data-status]").textContent = "Idle";
        return;
      }
      start(body);
    });
    panel = createPanel({
      id: "auramaxxing-buildmaxxing",
      title: "buildMaxxing",
      body,
    });
  },

  disable() {
    abort?.abort();
    abort = null;
    panel?.remove();
    panel = null;
  },
};
