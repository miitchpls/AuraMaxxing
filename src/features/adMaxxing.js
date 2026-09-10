import { adContainers } from "../api/dom.js";

const SCAN_INTERVAL_MS = 1000;

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

export default {
  id: "adMaxxing",
  name: "AdMaxxing",
  requires: ["dom"],

  enable: start,
  disable: stop,
};
