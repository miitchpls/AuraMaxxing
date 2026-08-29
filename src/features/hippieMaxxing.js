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
    </label>
    <span class="text-xs text-slate-400" data-status>Off</span>`;
  return body;
};

let removeSection = null;
let activeRun = null;

const stop = (body) => {
  const run = activeRun;
  activeRun = null;
  run?.controller.abort();
  body.querySelector("[data-status]").textContent = "Off";
};

const queueAction = (action, run, status) => {
  const key = actionKey(action);
  const now = Date.now();
  if (!actionReady(action, run.pending, run.lastAttempt, now)) return;

  run.lastAttempt.set(key, now);
  const send = action.type === "request" ? requestAlliance : extendAlliance;
  const pending = send(action.recipient, { signal: run.controller.signal })
    .then((result) => {
      if (!result.ready && activeRun === run) status.textContent = "Unavailable";
    })
    .catch((error) => {
      if (!run.controller.signal.aborted) {
        console.error("[AuraMaxxing] hippieMaxxing action failed", error);
      }
    })
    .finally(() => run.pending.delete(key));
  run.pending.set(key, pending);
};

const run = async (body, current) => {
  const signal = current.controller.signal;
  const status = body.querySelector("[data-status]");
  while (!signal.aborted) {
    try {
      const state = await allianceActions();
      if (signal.aborted) return;
      if (!state.ready) {
        status.textContent = "Waiting for a game";
      } else {
        status.textContent = "Active";
        for (const action of state.actions) queueAction(action, current, status);
      }
    } catch (error) {
      if (!signal.aborted) {
        status.textContent = "Unavailable";
        console.error("[AuraMaxxing] hippieMaxxing scan failed", error);
      }
    }
    await wait(POLL_INTERVAL_MS, signal).catch(() => {});
  }
};

const start = (body) => {
  if (activeRun !== null) return;
  const current = {
    controller: new AbortController(),
    lastAttempt: new Map(),
    pending: new Map(),
  };
  activeRun = current;
  body.querySelector("[data-status]").textContent = "Active";
  void run(body, current);
};

export default {
  id: "hippieMaxxing",
  name: "HippieMaxxing",
  requires: ["dom", "game", "intents"],

  enable() {
    const body = buildBody();
    body.querySelector("[data-toggle]").addEventListener("change", (event) => {
      if (event.currentTarget.checked) start(body);
      else stop(body);
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
