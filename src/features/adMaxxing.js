import { adContainers } from "../api/dom.js";
import { addSection } from "../ui/panel.js";

const SCAN_INTERVAL_MS = 1000;

let removeSection = null;
let scanTimer = null;
const detached = new Map();

export const removeAds = () => {
  for (const element of adContainers()) {
    const previous = detached.get(element.id);
    if (previous?.element === element && previous.marker.isConnected) {
      element.replaceWith(previous.marker);
      continue;
    }
    previous?.marker.remove();

    const marker = document.createComment("auramaxxing-ad-container");
    element.replaceWith(marker);
    detached.set(element.id, { element, marker });
  }
};

export const restoreAds = () => {
  for (const { element, marker } of detached.values()) {
    if (marker.isConnected) marker.replaceWith(element);
  }
  detached.clear();
};

const start = () => {
  if (scanTimer !== null) return;
  removeAds();
  scanTimer = setInterval(removeAds, SCAN_INTERVAL_MS);
};

const stop = () => {
  clearInterval(scanTimer);
  scanTimer = null;
  restoreAds();
};

const buildBody = () => {
  const body = document.createElement("div");
  body.className = "text-sm";
  body.innerHTML = `
    <label class="flex items-center gap-2">
      <input type="checkbox" data-toggle checked />
      <span>Hide advertisements</span>
    </label>`;
  return body;
};

export default {
  id: "adMaxxing",
  name: "AdMaxxing",
  requires: ["dom"],

  enable() {
    const body = buildBody();
    body.querySelector("[data-toggle]").addEventListener("change", (event) => {
      if (event.currentTarget.checked) start();
      else stop();
    });
    removeSection = addSection({
      id: "admaxxing",
      title: "AdMaxxing",
      body,
    });
    start();
  },

  disable() {
    stop();
    removeSection?.();
    removeSection = null;
  },
};
