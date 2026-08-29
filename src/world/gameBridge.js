const REQUEST = "auramaxxing:game-request";
const RESPONSE = "auramaxxing:game-response";

// Replies name the request they answer: a page can briefly hold two bridges (an
// installed extension plus a freshly loaded one), and both would answer the same
// id. The client keeps only the reply that matches what it asked for.
const reply = (data) =>
  window.dispatchEvent(
    new CustomEvent(RESPONSE, { detail: JSON.stringify(data) }),
  );

const inspect = async ({ id, screenX, screenY, unitType }) => {
  const element = document.querySelector("build-menu");
  const game = element?.game;
  const transform = element?.transformHandler;
  const player = game?.myPlayer?.();
  if (!game || !transform || !player) return reply({ kind: "inspect", id, ready: false });

  const world = transform.screenToWorldCoordinates(screenX, screenY);
  if (!world || !game.isValidCoord(world.x, world.y)) {
    return reply({ kind: "inspect", id, ready: true, valid: false });
  }

  const found = await player.buildables(game.ref(world.x, world.y), [unitType]);
  const unit = (Array.isArray(found) ? found : [found])[0];
  reply({
    kind: "inspect",
    id,
    ready: true,
    valid: true,
    canBuild: unit?.canBuild !== false,
    canUpgrade: unit?.canUpgrade !== false,
    cost: String(unit?.cost ?? 0),
    gold: String(player.gold()),
  });
};

// The next N prices. Every upgrade raises the unit count exactly like a new
// build does, so both follow the same rising curve. The game only hands over its
// running totals once the player owns one of a type; with none owned it gives
// just the next price, and the caller projects from there.
const quote = async ({ id, unitType, count }) => {
  const element = document.querySelector("build-menu");
  const player = element?.game?.myPlayer?.();
  if (!player) return reply({ kind: "quote", id, ready: false });

  const owned = player.units(unitType);
  const found = await player.buildables(owned[0]?.tile(), [unitType]);
  const unit = (Array.isArray(found) ? found : [found])[0];
  if (!unit) return reply({ kind: "quote", id, ready: false });

  const totals = unit.upgradeCosts;
  const exact = Array.isArray(totals) && count <= totals.length;
  reply({
    kind: "quote",
    id,
    ready: true,
    exact,
    total: exact ? String(totals[count - 1]) : null,
    base: String(unit.cost),
    gold: String(player.gold()),
  });
};

window.addEventListener(REQUEST, (event) => {
  const request = JSON.parse(event.detail);
  const kind = request.kind ?? "inspect";
  const handler = kind === "quote" ? quote : inspect;
  handler(request).catch(() => reply({ kind, id: request.id, ready: false }));
});

document.documentElement.dataset.auramaxxingBridge = "1";
