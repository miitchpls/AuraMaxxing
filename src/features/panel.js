const PANEL_ID = "auramaxxing-panel";
const MARGIN_PX = 16;

// Tailwind classes are lifted from the game's own components: its stylesheet
// only contains classes found in its source, so an invented one renders nothing.
const PANEL_CLASS =
  "fixed z-900 flex flex-col p-2 bg-gray-800/92 backdrop-blur-sm shadow-xs rounded-lg text-white select-none";
const BUTTON_CLASS =
  "ml-auto cursor-pointer px-1 bg-gray-700/50 hover:bg-gray-600 border rounded-md border-slate-500 transition-colors";

let panel = null;

const clamp = (value, max) => Math.max(0, Math.min(value, max));

const makeDraggable = (element, handle) => {
  let grabX = 0;
  let grabY = 0;

  handle.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-collapse]")) return;
    grabX = event.clientX - element.offsetLeft;
    grabY = event.clientY - element.offsetTop;
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  handle.addEventListener("pointermove", (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) return;
    const maxLeft = window.innerWidth - element.offsetWidth;
    const maxTop = window.innerHeight - element.offsetHeight;
    element.style.left = `${clamp(event.clientX - grabX, maxLeft)}px`;
    element.style.top = `${clamp(event.clientY - grabY, maxTop)}px`;
  });
};

const makeCollapsible = (element) => {
  const body = element.querySelector("[data-body]");
  const button = element.querySelector("[data-collapse]");
  button.addEventListener("click", () => {
    const collapsed = body.classList.toggle("hidden");
    button.innerHTML = collapsed ? "&plus;" : "&minus;";
  });
};

export default {
  id: "panel",
  name: "Floating panel",
  requires: ["dom"],

  enable({ dom }) {
    if (document.getElementById(PANEL_ID)) return;

    panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.className = PANEL_CLASS;
    panel.style.cssText = `left:${MARGIN_PX}px;top:0;width:220px;`;
    panel.innerHTML = `
      <div class="flex items-center gap-2 text-sm" style="cursor:move" data-drag>
        <span>AuraMaxxing</span>
        <button class="${BUTTON_CLASS}" data-collapse>&minus;</button>
      </div>
      <div class="mt-2 text-sm text-slate-300" data-body>
        Placeholder text.
      </div>`;
    dom.host().appendChild(panel);

    panel.style.top = `${(window.innerHeight - panel.offsetHeight) / 2}px`;
    makeDraggable(panel, panel.querySelector("[data-drag]"));
    makeCollapsible(panel);
  },

  disable() {
    panel?.remove();
    panel = null;
  },
};
