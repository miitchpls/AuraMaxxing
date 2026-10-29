import { host, inMatch, onMatchChange } from "../api/dom.js";

const PANEL_ID = "auramaxxing-panel";
const MARGIN_PX = 16;
const WIDTH_PX = 220;

// Tailwind classes are lifted from the game's own components: its stylesheet
// only contains classes found in its source, so an invented one renders nothing.
const PANEL_CLASS =
  "fixed z-999 flex flex-col p-2 bg-gray-800/92 backdrop-blur-sm shadow-xs rounded-lg text-white select-none";
const TOGGLE_CLASS =
  "cursor-pointer px-1 bg-gray-700/50 hover:bg-gray-600 border rounded-md border-slate-500 transition-colors";
// One card per feature: the section is the card, everything it needs lives
// inside it, and nothing else in the panel draws a box of its own.
const SECTION_CLASS =
  "flex flex-col p-2 bg-gray-900/60 border border-slate-500 rounded-md";
const SECTION_HEADER_CLASS = "flex items-center gap-2 text-sm";

const clamp = (value, max) => Math.max(0, Math.min(value, max));

const makeDraggable = (element, handle) => {
  let grabX = 0;
  let grabY = 0;
  let maxLeft = 0;
  let maxTop = 0;

  handle.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    grabX = event.clientX - element.offsetLeft;
    grabY = event.clientY - element.offsetTop;
    maxLeft = window.innerWidth - element.offsetWidth;
    maxTop = window.innerHeight - element.offsetHeight;
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  handle.addEventListener("pointermove", (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) return;
    element.style.left = `${clamp(event.clientX - grabX, maxLeft)}px`;
    element.style.top = `${clamp(event.clientY - grabY, maxTop)}px`;
  });
};

const setCollapsed = (button, target, collapsed) => {
  target.classList.toggle("hidden", collapsed);
  button.innerHTML = collapsed ? "&plus;" : "&minus;";
  button.setAttribute("aria-expanded", String(!collapsed));
};

const toggles = new Map();

const updateToggles = (active) => {
  for (const [button, target] of toggles) {
    button.disabled = !active;
    if (!active) setCollapsed(button, target, true);
  }
};

const makeToggle = (button, target) => {
  toggles.set(button, target);
  setCollapsed(button, target, target.classList.contains("hidden"));
  updateToggles(inMatch());
  button.addEventListener("click", () => {
    if (!inMatch()) return;
    setCollapsed(button, target, !target.classList.contains("hidden"));
  });
};

let panel = null;
let sections = null;
let stopMatchChange = null;

const createShell = () => {
  panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.className = PANEL_CLASS;
  panel.style.cssText = `left:${MARGIN_PX}px;top:0;width:${WIDTH_PX}px;`;
  panel.innerHTML = `
    <div class="flex items-center gap-2 text-sm" style="cursor:move" data-drag>
      <span>AuraMaxxing</span>
      <button class="ml-auto ${TOGGLE_CLASS}" data-collapse>&minus;</button>
    </div>
    <div class="flex flex-col gap-2 mt-2" data-sections></div>`;
  host().appendChild(panel);

  sections = panel.querySelector("[data-sections]");
  panel.style.top = `${(window.innerHeight - panel.offsetHeight) / 2}px`;
  makeDraggable(panel, panel.querySelector("[data-drag]"));
  makeToggle(panel.querySelector("[data-collapse]"), sections);
  stopMatchChange = onMatchChange(updateToggles);
};

export const addSection = ({ id, title, body }) => {
  if (panel === null) createShell();

  const section = document.createElement("div");
  section.id = `auramaxxing-section-${id}`;
  section.className = SECTION_CLASS;
  section.innerHTML = `
    <div class="${SECTION_HEADER_CLASS}">
      <span>${title}</span>
      <button class="ml-auto ${TOGGLE_CLASS}" data-collapse>&plus;</button>
    </div>`;
  body.classList.add("mt-2", "hidden");
  section.appendChild(body);
  sections.appendChild(section);
  const toggle = section.querySelector("[data-collapse]");
  makeToggle(toggle, body);

  return () => {
    toggles.delete(toggle);
    section.remove();
    if (sections.children.length === 0) {
      stopMatchChange();
      stopMatchChange = null;
      toggles.clear();
      panel.remove();
      panel = null;
      sections = null;
    }
  };
};
