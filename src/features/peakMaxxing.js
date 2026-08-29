import {
  peakTroopTarget,
  toDisplayedTroops,
  troopIncreaseRateAt,
  troopState,
} from "../api/game.js";
import { addSection } from "../ui/panel.js";

const REFRESH_MS = 2000;
const number = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumSignificantDigits: 3,
});

export const formatTroops = (troops) =>
  number.format(toDisplayedTroops(troops));

let refreshTimer = null;
let removeSection = null;
let session = 0;
let refreshing = false;

export const peakGaugePosition = (efficiency, troops, peakTroops) => {
  const distanceFromEdge = Math.max(0, Math.min(1, efficiency)) * 50;
  return troops <= peakTroops ? distanceFromEdge : 100 - distanceFromEdge;
};

const buildBody = () => {
  const body = document.createElement("div");
  body.className = "text-sm";
  body.innerHTML = `
    <span data-status>Waiting for a match</span>
    <div class="hidden" data-live>
      <div class="flex items-center gap-2">
        <span>Peak generation</span>
        <strong class="ml-auto" data-generation></strong>
      </div>
      <div
        class="mt-2"
        data-gauge
        role="meter"
        aria-label="Peak generation"
        aria-valuemin="0"
        aria-valuemax="100"
        style="position:relative;height:10px;border-radius:9999px;background:linear-gradient(to right,#dc2626 0%,#eab308 25%,#22c55e 45%,#22c55e 55%,#eab308 75%,#dc2626 100%)"
      >
        <span
          data-marker
          style="position:absolute;left:50%;top:-3px;width:3px;height:16px;border-radius:2px;background:white;box-shadow:0 0 0 1px rgb(0 0 0 / 75%);transform:translateX(-50%);transition:left 200ms ease-out"
        ></span>
      </div>
      <div class="text-xs text-slate-400 text-center">100%</div>
      <div class="mt-1" data-target></div>
    </div>`;
  return body;
};

const clearBody = (body, message) => {
  body.querySelector("[data-status]").textContent = message;
  body.querySelector("[data-status]").classList.remove("hidden");
  body.querySelector("[data-live]").classList.add("hidden");
};

const render = (body, state) => {
  const peakTroops = peakTroopTarget(state.maxTroops);
  if (peakTroops === null) {
    clearBody(body, "Troop curve unavailable");
    return;
  }

  const peakRate = troopIncreaseRateAt(peakTroops, state.maxTroops) * 10;
  const rateRatio = Math.max(
    0,
    Math.min(1, state.increasePerSecond / peakRate),
  );
  const generationPercent = Math.round(rateRatio * 100);
  const gaugePosition = peakGaugePosition(
    rateRatio,
    state.troops,
    peakTroops,
  );
  const targetTroops = formatTroops(peakTroops);

  body.querySelector("[data-status]").classList.add("hidden");
  body.querySelector("[data-live]").classList.remove("hidden");
  body.querySelector("[data-generation]").textContent = `${generationPercent}%`;
  body.querySelector("[data-gauge]").setAttribute(
    "aria-valuenow",
    String(generationPercent),
  );
  body.querySelector("[data-marker]").style.left = `${gaugePosition}%`;
  body.querySelector("[data-target]").textContent =
    `Peak: ${targetTroops} troops`;
};

const refresh = async (body, currentSession) => {
  if (refreshing) return;
  refreshing = true;
  try {
    const state = await troopState();
    if (session !== currentSession) return;
    if (!state.ready) clearBody(body, "Waiting for a match");
    else render(body, state);
  } catch {
    if (session === currentSession) clearBody(body, "Troop curve unavailable");
  } finally {
    refreshing = false;
  }
};

export default {
  id: "peakMaxxing",
  name: "peakMaxxing",
  requires: ["dom", "game"],

  enable() {
    const body = buildBody();
    const currentSession = ++session;
    removeSection = addSection({
      id: "peakmaxxing",
      title: "PeakMaxxing",
      body,
    });
    void refresh(body, currentSession);
    refreshTimer = setInterval(
      () => void refresh(body, currentSession),
      REFRESH_MS,
    );
  },

  disable() {
    session++;
    clearInterval(refreshTimer);
    refreshTimer = null;
    removeSection?.();
    removeSection = null;
  },
};
