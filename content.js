// Floating panel injected into OpenFront. Tailwind classes are lifted verbatim
// from src/client/hud/layers/GameLeftSidebar.ts so we ride the game's own CSS
// build — inventing new utility classes would produce nothing, they are not in it.
const PANEL_ID = "auramaxxing-panel";

if (!document.getElementById(PANEL_ID)) {
  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.className =
    "fixed z-900 flex flex-col p-2 bg-gray-800/92 backdrop-blur-sm shadow-xs rounded-lg text-white select-none";
  panel.style.cssText = "left:16px;top:0;width:220px;";
  panel.innerHTML = `
    <div class="flex items-center gap-2 text-sm" style="cursor:move" data-drag>
      <span>AuraMaxxing</span>
      <button
        class="ml-auto cursor-pointer px-1 bg-gray-700/50 hover:bg-gray-600 border rounded-md border-slate-500 transition-colors"
        data-collapse
      >&minus;</button>
    </div>
    <div class="mt-2 text-sm text-slate-300" data-body>
      Testo di prova. Qui ci finiranno le funzionalità.
    </div>`;
  document.body.appendChild(panel);

  // vertical center, measured after layout so dragging stays plain px math
  panel.style.top = `${(window.innerHeight - panel.offsetHeight) / 2}px`;

  const body = panel.querySelector("[data-body]");
  const collapse = panel.querySelector("[data-collapse]");
  collapse.addEventListener("click", () => {
    const hidden = body.classList.toggle("hidden");
    collapse.innerHTML = hidden ? "&plus;" : "&minus;";
  });

  const handle = panel.querySelector("[data-drag]");
  let dx = 0;
  let dy = 0;
  handle.addEventListener("pointerdown", (e) => {
    if (e.target.closest("[data-collapse]")) return;
    dx = e.clientX - panel.offsetLeft;
    dy = e.clientY - panel.offsetTop;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  handle.addEventListener("pointermove", (e) => {
    if (!handle.hasPointerCapture(e.pointerId)) return;
    const clamp = (v, max) => Math.max(0, Math.min(v, max));
    panel.style.left = `${clamp(e.clientX - dx, window.innerWidth - panel.offsetWidth)}px`;
    panel.style.top = `${clamp(e.clientY - dy, window.innerHeight - panel.offsetHeight)}px`;
  });
}
