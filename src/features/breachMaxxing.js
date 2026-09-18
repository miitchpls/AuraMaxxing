import { addSection } from "../ui/panel.js";

let removeSection = null;
let controller = null;
let body = null;
let lastTarget = null;
const buttonClass =
  "w-full cursor-pointer px-1 py-1 bg-gray-700/50 hover:bg-gray-600 border rounded-md border-slate-500 transition-colors";
const seconds = (value) => `${value.toFixed(1)}s`;

const feature = {
  id: "breachMaxxing",
  name: "BreachMaxxing",
  requires: ["dom", "game", "input", "breach"],
  enable(api) {
    body = document.createElement("div");
    body.className = "flex flex-col gap-2 text-sm";
    body.innerHTML = `
      <p class="text-xs">Estimate an atom-bomb breach at a map point.</p>
      <button type="button" class="${buttonClass}" data-pick>Select target</button>
      <button type="button" class="${buttonClass}" data-refresh disabled>Recalculate</button>
      <p class="text-xs" role="status" aria-live="polite" data-status>Select a target to calculate.</p>
      <div class="flex flex-col gap-2 text-xs" data-result></div>`;
    const pick = body.querySelector("[data-pick]");
    const refresh = body.querySelector("[data-refresh]");
    const status = body.querySelector("[data-status]");
    const output = body.querySelector("[data-result]");
    const line = (text, bold = false) => {
      const p = document.createElement("p");
      if (bold) p.className = "font-bold";
      p.textContent = text;
      output.appendChild(p);
    };
    const run = async (select) => {
      controller?.abort();
      const runController = new AbortController();
      controller = runController;
      const { signal } = runController;
      output.replaceChildren();
      try {
        let snapshot;
        if (select) {
          status.textContent = "Click the map. Escape cancels.";
          pick.textContent = "Cancel selection";
          const point = await api.input.pickMapPoint({
            signal,
            exclude: body.closest("#auramaxxing-panel"),
          });
          if (signal.aborted) return;
          if (!point) {
            status.textContent = "Selection cancelled.";
            return;
          }
          snapshot = await api.game.breachAt(point.x, point.y);
        } else {
          snapshot = await api.game.breachWorld(lastTarget.x, lastTarget.y);
        }
        if (signal.aborted) return;
        if (!snapshot.ready) {
          status.textContent =
            "Game state unavailable. Join a match and try again.";
          return;
        }
        if (!snapshot.valid) {
          status.textContent = "Select a point inside the map.";
          return;
        }
        lastTarget = snapshot.target;
        refresh.disabled = false;
        if (snapshot.friendlyTarget) {
          status.textContent =
            "Select an enemy or unowned target. Alliance changes are not simulated.";
          return;
        }
        status.textContent = "Finding a breach plan…";
        pick.textContent = "Select another target";
        const result = await api.breach.calculate(snapshot, { signal });
        if (signal.aborted) return;
        if (result.status === "no-silos") {
          status.textContent =
            "Build a missile silo first; its position defines the launch route.";
          return;
        }
        status.textContent = `Target ${snapshot.target.x}, ${snapshot.target.y}`;
        if (result.status === "not-found") {
          line(
            `No plan found within 5 silos and ${result.maxBombs} bombs. Try another launch location.`,
          );
          return;
        }
        const { plan } = result;
        line(`${plan.bombs} atom bomb${plan.bombs === 1 ? "" : "s"}`, true);
        line(
          `${plan.levels.length} silo${plan.levels.length === 1 ? "" : "s"} · levels ${plan.levels.join(" + ")}`,
        );
        line(`Fire with the ${plan.directionUp ? "upward" : "downward"} arc.`);
        line(
          plan.bombs <= 5
            ? "Send one order."
            : `Send ×5 orders every ${seconds(plan.orderIntervalSeconds)}, over ${seconds(plan.orderSeconds)}.`,
        );
        line(
          `Place at ${plan.positions.map((p) => `(${p.x}, ${p.y})`).join(", ")}.`,
        );
        line(
          "Assumes fully loaded SAMs and silos. Check placement; all launch orders must be accepted.",
        );
      } catch (error) {
        if (signal.aborted) return;
        console.warn(
          "[AuraMaxxing] breachMaxxing disabled after calculation failure",
          error,
        );
        feature.disable();
      } finally {
        if (controller === runController) {
          controller = null;
          pick.textContent = "Select target";
        }
      }
    };
    pick.addEventListener("click", () => {
      if (pick.textContent === "Cancel selection") {
        controller?.abort();
        controller = null;
        pick.textContent = "Select target";
        status.textContent = "Selection cancelled.";
      } else void run(true);
    });
    refresh.addEventListener("click", () => {
      if (lastTarget) void run(false);
    });
    removeSection = addSection({ id: feature.id, title: feature.name, body });
  },
  disable() {
    controller?.abort();
    controller = null;
    removeSection?.();
    removeSection = null;
    body = null;
    lastTarget = null;
  },
};
export default feature;
