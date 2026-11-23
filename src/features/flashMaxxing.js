import { captureBuildKeys } from "../api/input.js";
import { flashBuild } from "../api/intents.js";
import { addSection } from "../ui/panel.js";

let activeRun = null;
let removeSection = null;

const start = () => {
  if (activeRun !== null) return;
  const controller = new AbortController();
  const build = (action, x, y) =>
    flashBuild(x, y, action, { signal: controller.signal }).catch((error) => {
      if (!controller.signal.aborted) {
        console.error("[AuraMaxxing] flashMaxxing build failed", error);
      }
    });
  activeRun = { controller, releaseKeys: captureBuildKeys(build) };
};

const stop = () => {
  activeRun?.releaseKeys();
  activeRun?.controller.abort();
  activeRun = null;
};

const buildBody = () => {
  const body = document.createElement("div");
  body.className = "flex flex-col gap-2 text-sm";
  body.innerHTML = `
    <label class="flex items-center gap-2">
      <input type="checkbox" data-toggle />
      <span>Build under the cursor on key press</span>
    </label>`;
  return body;
};

export default {
  id: "flashMaxxing",
  name: "FlashMaxxing",
  requires: ["dom", "game", "input", "intents"],

  enable() {
    const body = buildBody();
    body.querySelector("[data-toggle]").addEventListener("change", (event) => {
      if (event.currentTarget.checked) start();
      else stop();
    });
    removeSection = addSection({
      id: "flashmaxxing",
      title: "FlashMaxxing",
      body,
    });
  },

  disable() {
    stop();
    removeSection?.();
    removeSection = null;
  },
};
