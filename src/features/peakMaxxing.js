import { peakTroopPlan, troopIncreaseRateAt, troopState } from "../api/game.js";
import { addSection } from "../ui/panel.js";

const REFRESH_MS = 2000;
const number = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

let refreshTimer = null;
let removeSection = null;
let session = 0;
let refreshing = false;

const buildBody = () => {
  const body = document.createElement("div");
  body.className = "flex flex-col gap-1 text-sm";
  body.innerHTML = `
    <span data-position>Waiting for a match</span>
    <span class="text-white/60" data-rate></span>
    <span data-target></span>
    <span data-advice></span>`;
  return body;
};

const clearBody = (body, message) => {
  body.querySelector("[data-position]").textContent = message;
  for (const selector of ["[data-rate]", "[data-target]", "[data-advice]"]) {
    body.querySelector(selector).textContent = "";
  }
};

const render = (body, state) => {
  const plan = peakTroopPlan(state.troops, state.maxTroops);
  if (plan === null) {
    clearBody(body, "Troop curve unavailable");
    return;
  }

  const currentRatio = state.troops / state.maxTroops;
  const peakRate = troopIncreaseRateAt(plan.targetTroops, state.maxTroops) * 10;
  const rateRatio = Math.max(
    0,
    Math.min(1, state.increasePerSecond / peakRate),
  );
  const side =
    Math.abs(state.troops - plan.targetTroops) / state.maxTroops < 0.005
      ? "at peak"
      : state.troops < plan.targetTroops
        ? "below peak"
        : "past peak";

  body.querySelector("[data-position]").textContent =
    `Curve: ${(currentRatio * 100).toFixed(1)}% capacity · ${side}`;
  body.querySelector("[data-rate]").textContent =
    `Generation: ${number.format(state.increasePerSecond)}/s · ${Math.round(rateRatio * 100)}% of peak`;
  body.querySelector("[data-target]").textContent =
    `Peak: ${number.format(plan.targetTroops)} troops · ${(plan.targetRatio * 100).toFixed(1)}%`;
  body.querySelector("[data-advice]").textContent =
    plan.attackPercent > 0
      ? `Attack up to ${plan.attackPercent}% now`
      : state.troops < plan.targetTroops
        ? `Hold until ${number.format(plan.targetTroops)} troops`
        : `Keep at least ${number.format(plan.targetTroops)} troops`;
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
