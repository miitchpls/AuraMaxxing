import { addSection } from "../ui/panel.js";

let removeSection = null;
let controller = null;
let body = null;
let lastTarget = null;
const buttonClass =
  "w-full cursor-pointer px-1 py-1 bg-gray-700/50 hover:bg-gray-600 border rounded-md border-slate-500 transition-colors";

const feature = {
  id: "breachMaxxing",
  name: "BreachMaxxing",
  requires: ["dom", "game", "input", "breach"],
  enable(api) {
    body = document.createElement("div");
    body.className = "flex flex-col gap-2 text-sm";
    body.innerHTML = `
      <label class="flex items-center gap-2">
        <input type="checkbox" data-only-target />
        <span>Only target</span>
      </label>
      <button type="button" class="${buttonClass}" data-pick>Select target</button>
      <button type="button" class="${buttonClass}" data-refresh disabled>Recalculate</button>
      <p class="text-xs" role="status" aria-live="polite" data-status hidden></p>
      <div class="flex flex-col gap-2 text-xs" aria-live="polite" data-result></div>`;
    const pick = body.querySelector("[data-pick]"),
      refresh = body.querySelector("[data-refresh]");
    const onlyTarget = body.querySelector("[data-only-target]");
    const status = body.querySelector("[data-status]"),
      output = body.querySelector("[data-result]");
    const setStatus = (text) => {
      status.textContent = text;
      status.hidden = !text;
    };
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
          setStatus("Click the map. Escape cancels.");
          pick.textContent = "Cancel selection";
          const point = await api.input.pickMapPoint({
            signal,
            exclude: body.closest("#auramaxxing-panel"),
          });
          if (signal.aborted) return;
          if (!point) {
            setStatus("");
            return;
          }
          snapshot = await api.game.breachAt(point.x, point.y, {
            onlyTarget: onlyTarget.checked,
          });
        } else
          snapshot = await api.game.breachWorld(lastTarget.x, lastTarget.y, {
            onlyTarget: onlyTarget.checked,
          });
        if (signal.aborted) return;
        if (!snapshot.ready) {
          setStatus("Game unavailable. Join a match and retry.");
          return;
        }
        if (!snapshot.valid) {
          setStatus("Select a point inside the map.");
          return;
        }
        lastTarget = snapshot.target;
        refresh.disabled = false;
        if (snapshot.protectedTarget) {
          setStatus(
            "Select a target outside your own or your team's territory.",
          );
          return;
        }
        setStatus("Calculating…");
        pick.textContent = "Select another target";
        const result = await api.breach.calculate(snapshot, { signal });
        if (signal.aborted) return;
        if (result.status === "no-silos") {
          setStatus("Build a silo to set the launch position.");
          return;
        }
        if (result.status === "no-prices") {
          setStatus("Prices unavailable. Recalculate.");
          return;
        }
        if (result.status === "not-found") {
          setStatus(
            `No plan found within ${result.maxBombs} bombs. Try another launch position.`,
          );
          return;
        }
        setStatus("");
        const { plan } = result;
        const gold = new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 2,
        }).format(BigInt(plan.cost));
        line(`${plan.bombs} atom bombs · ${gold} gold`, true);
        line(
          `${plan.levels.length} silo${plan.levels.length === 1 ? "" : "s"}: ${plan.levels.join(" + ")}`,
        );
        line(`${plan.directionUp ? "Upward" : "Downward"} arc`);
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
        setStatus("");
      } else void run(true);
    });
    refresh.addEventListener("click", () => {
      if (lastTarget) void run(false);
    });
    onlyTarget.addEventListener("change", () => {
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
