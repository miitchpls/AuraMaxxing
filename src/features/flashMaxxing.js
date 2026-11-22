import { captureBuildKeys } from "../api/input.js";
import { flashBuild } from "../api/intents.js";
import { addSection } from "../ui/panel.js";

let releaseKeys = null;
let removeSection = null;

const build = (action, x, y) =>
  flashBuild(x, y, action).catch((error) =>
    console.error("[AuraMaxxing] flashMaxxing build failed", error),
  );

const start = () => {
  releaseKeys ??= captureBuildKeys(build);
};

const stop = () => {
  releaseKeys?.();
  releaseKeys = null;
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
