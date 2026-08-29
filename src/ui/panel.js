import { host } from "../api/dom.js";

const MARGIN_PX = 16;

// Tailwind classes are lifted from the game's own components: its stylesheet
// only contains classes found in its source, so an invented one renders nothing.
const PANEL_CLASS =
  "fixed z-900 flex flex-col p-2 bg-gray-800/92 backdrop-blur-sm shadow-xs rounded-lg text-white select-none";
const COLLAPSE_CLASS =
  "ml-auto cursor-pointer px-1 bg-gray-700/50 hover:bg-gray-600 border rounded-md border-slate-500 transition-colors";

const clamp = (value, max) => Math.max(0, Math.min(value, max));

const makeDraggable = (panel, handle) => {
  let grabX = 0;
  let grabY = 0;

  handle.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-collapse]")) return;
    grabX = event.clientX - panel.offsetLeft;
    grabY = event.clientY - panel.offsetTop;
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  handle.addEventListener("pointermove", (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) return;
    panel.style.left = `${clamp(event.clientX - grabX, window.innerWidth - panel.offsetWidth)}px`;
    panel.style.top = `${clamp(event.clientY - grabY, window.innerHeight - panel.offsetHeight)}px`;
  });
};

const makeCollapsible = (panel, body) => {
  const button = panel.querySelector("[data-collapse]");
  button.addEventListener("click", () => {
    const collapsed = body.classList.toggle("hidden");
    button.innerHTML = collapsed ? "&plus;" : "&minus;";
  });
};

export const createPanel = ({ id, title, body, width = 220 }) => {
  const panel = document.createElement("div");
  panel.id = id;
  panel.className = PANEL_CLASS;
  panel.style.cssText = `left:${MARGIN_PX}px;top:0;width:${width}px;`;
  panel.innerHTML = `
    <div class="flex items-center gap-2 text-sm" style="cursor:move" data-drag>
      <span>${title}</span>
      <button class="${COLLAPSE_CLASS}" data-collapse>&minus;</button>
    </div>`;

  body.classList.add("mt-2");
  panel.appendChild(body);
  host().appendChild(panel);

  panel.style.top = `${(window.innerHeight - panel.offsetHeight) / 2}px`;
  makeDraggable(panel, panel.querySelector("[data-drag]"));
  makeCollapsible(panel, body);

  return panel;
};
