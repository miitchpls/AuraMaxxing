import { allianceActions } from "../api/game.js";
import { extendAlliance, requestAlliance } from "../api/intents.js";
import { addSection } from "../ui/panel.js";

const POLL_INTERVAL_MS = 2000;
const RETRY_INTERVAL_MS = 5000;

const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(done, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    function done() {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }
    signal.addEventListener("abort", onAbort, { once: true });
  });

export const actionKey = ({ type, recipient }) => `${type}:${recipient}`;

export const actionReady = (action, pending, lastAttempt, now) => {
  const key = actionKey(action);
  return (
    !pending.has(key) &&
    now - (lastAttempt.get(key) ?? 0) >= RETRY_INTERVAL_MS
  );
};

const buildBody = () => {
  const body = document.createElement("div");
  body.className = "flex flex-col gap-2 text-sm";
  body.innerHTML = `
    <label class="flex items-center gap-2">
      <input type="checkbox" data-toggle />
      <span>Automatic alliances</span>
    </label>`;
  return body;
};

let removeSection = null;
let activeRun = null;

const stop = () => {
  const run = activeRun;
  activeRun = null;
  run?.controller.abort();
};

const queueAction = (action, run) => {
  const key = actionKey(action);
  const now = Date.now();
  if (!actionReady(action, run.pending, run.lastAttempt, now)) return;

  run.lastAttempt.set(key, now);
  const send = action.type === "request" ? requestAlliance : extendAlliance;
  const pending = send(action.recipient, { signal: run.controller.signal })
    .catch((error) => {
      if (!run.controller.signal.aborted) {
        console.error("[AuraMaxxing] hippieMaxxing action failed", error);
      }
    })
    .finally(() => run.pending.delete(key));
  run.pending.set(key, pending);
};

const run = async (current) => {
  const signal = current.controller.signal;
  while (!signal.aborted) {
    try {
      const state = await allianceActions();
      if (signal.aborted) return;
      if (state.ready) {
        for (const action of state.actions) queueAction(action, current);
      }
    } catch (error) {
      if (!signal.aborted) {
        console.error("[AuraMaxxing] hippieMaxxing scan failed", error);
      }
    }
    await wait(POLL_INTERVAL_MS, signal).catch(() => {});
  }
};

const start = () => {
  if (activeRun !== null) return;
  const current = {
    controller: new AbortController(),
    lastAttempt: new Map(),
    pending: new Map(),
  };
  activeRun = current;
  void run(current);
};

export default {
  id: "hippieMaxxing",
  name: "HippieMaxxing",
  requires: ["dom", "game", "intents"],

  enable() {
    const body = buildBody();
    body.querySelector("[data-toggle]").addEventListener("change", (event) => {
      if (event.currentTarget.checked) start();
      else stop();
    });
    removeSection = addSection({
      id: "hippiemaxxing",
      title: "HippieMaxxing",
      body,
    });
  },

  disable() {
    const run = activeRun;
    activeRun = null;
    run?.controller.abort();
    removeSection?.();
    removeSection = null;
  },
};
