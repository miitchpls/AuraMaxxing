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
      <label class="flex flex-col gap-2 text-xs">Orders per second (×5)
        <select class="bg-gray-800 text-white border rounded-md" data-rate>
          <option value="1">10 / second</option><option value="2">5 / second</option>
          <option value="5">2 / second</option><option value="10">1 / second</option>
        </select>
      </label>
      <label class="flex items-center gap-2 text-xs"><input type="checkbox" data-direction checked>Arc upwards</label>
      <button type="button" class="${buttonClass}" data-refresh disabled>Recalculate</button>
      <p class="text-xs" role="status" aria-live="polite" data-status>Select a target to calculate.</p>
      <div class="flex flex-col gap-2 text-xs" data-result></div>`;
    const pick = body.querySelector("[data-pick]");
    const refresh = body.querySelector("[data-refresh]");
    const rate = body.querySelector("[data-rate]");
    const direction = body.querySelector("[data-direction]");
    const status = body.querySelector("[data-status]");
    const output = body.querySelector("[data-result]");
    let destination = output;
    const line = (text, bold = false) => {
      const p = document.createElement("p");
      if (bold) p.className = "font-bold";
      p.textContent = text;
      destination.appendChild(p);
    };
    const run = async (select) => {
      controller?.abort();
      const runController = new AbortController();
      controller = runController;
      const { signal } = runController;
      output.replaceChildren();
      destination = output;
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
        status.textContent = "Calculating trajectories and SAM reloads…";
        pick.textContent = "Select another target";
        const result = await api.breach.calculate(snapshot, {
          gap: Number(rate.value),
          directionUp: direction.checked,
          signal,
        });
        if (signal.aborted) return;
        if (result.status === "no-silos") {
          status.textContent =
            "Build a missile silo first; its position defines the launch route.";
          return;
        }
        status.textContent = `Target ${snapshot.target.x}, ${snapshot.target.y} · snapshot at tick ${snapshot.tick}`;
        const current = result.current;
        const engaged = current.shots.filter((s) => s.shots > 0);
        line(
          `${engaged.length} SAMs would fire on this salvo. ${result.ready} missiles ready.`,
        );
        line(
          current.breached
            ? `Estimated breach: ${current.bombs} atom bombs.`
            : `No breach predicted with ${current.launched} bombs.`,
          true,
        );
        if (current.breached) {
          line(
            `Send ×5 orders over ${seconds(current.orderSeconds)}. Departures span ${seconds(current.departureSeconds)}.`,
          );
          if (snapshot.bombCost !== null) {
            const cost = BigInt(snapshot.bombCost) * BigInt(current.bombs);
            line(
              `Bomb cost: ${cost.toLocaleString("en-US")} gold${cost > BigInt(snapshot.gold) ? " — not enough gold" : ""}.`,
            );
          }
        }
        if (!snapshot.canLaunch)
          line(
            "The game currently rejects launches at this point. Check gold, ammo and target restrictions.",
          );
        const plans = result.recommendations.filter((r) => r.plan);
        line("Suggested layout", true);
        if (!plans.length)
          line(`None found within ${result.maxBombs} bombs and 5 silos.`);
        const best = plans[0];
        if (best) {
          const { silos, plan } = best;
          line(
            `${silos} silo${silos === 1 ? "" : "s"}: levels ${plan.levels.join(" + ")}.`,
            true,
          );
          line(
            `${plan.bombs} bombs · ×5 orders in ${seconds(plan.orderSeconds)} · departures over ${seconds(plan.departureSeconds)}.`,
          );
        }
        const details = document.createElement("details");
        details.innerHTML =
          '<summary class="cursor-pointer">Other layouts & assumptions</summary>';
        output.appendChild(details);
        destination = document.createElement("div");
        destination.className = "flex flex-col gap-2 mt-2";
        details.appendChild(destination);
        for (const { silos, plan } of plans.slice(1)) {
          line(
            `${silos} silos: ${plan.levels.join(" + ")} → ${plan.bombs} bombs; orders in ${seconds(plan.orderSeconds)}.`,
          );
        }
        if (!result.recommendations[0].plan)
          line(`One silo: no breach found up to level ${result.maxBombs}.`);
        line(
          `Layouts start at ${result.anchor.x}, ${result.anchor.y}, then extend south every ${snapshot.rules.structureSpacing} tiles. Fully loaded; check ownership and space before building.`,
        );
        line(
          `Smallest levels found for these balanced layouts, capped at ${result.maxBombs} bombs. Other placements can differ.`,
        );
        line(
          `SAM levels firing: ${engaged.map((s) => snapshot.sams.find((sam) => sam.id === s.id).level).join(" + ") || "none"}.`,
        );
        destination = output;
        line(
          "Estimate assumes accepted orders and unchanged defenses. Recalculate before firing.",
        );
        if (snapshot.inFlight)
          line(
            `${snapshot.inFlight} missiles in flight are excluded; the battle may change the result.`,
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
    const changed = () => {
      controller?.abort();
      controller = null;
      pick.textContent = "Select target";
      output.replaceChildren();
      status.textContent =
        "Settings changed. Recalculate to update the estimate.";
    };
    rate.addEventListener("change", changed);
    direction.addEventListener("change", changed);
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
