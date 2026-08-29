const REQUEST = "auramaxxing:game-request";
const RESPONSE = "auramaxxing:game-response";

// Replies name the request they answer: a page can briefly hold two bridges (an
// installed extension plus a freshly loaded one), and both would answer the same
// id. The client keeps only the reply that matches what it asked for.
const reply = (data) =>
  window.dispatchEvent(
    new CustomEvent(RESPONSE, { detail: JSON.stringify(data) }),
  );

const inspect = async ({
  id,
  screenX,
  screenY,
  worldX,
  worldY,
  unitType,
  usesMissile = false,
  count = 1,
}) => {
  const element = document.querySelector("build-menu");
  const game = element?.game;
  const transform = element?.transformHandler;
  const player = game?.myPlayer?.();
  if (!game || !transform || !player) {
    return reply({ kind: "inspect", id, ready: false });
  }

  const world =
    Number.isInteger(worldX) && Number.isInteger(worldY)
      ? { x: worldX, y: worldY }
      : transform.screenToWorldCoordinates(screenX, screenY);
  if (!world || !game.isValidCoord(world.x, world.y)) {
    return reply({ kind: "inspect", id, ready: true, valid: false });
  }

  const found = await player.buildables(game.ref(world.x, world.y), [unitType]);
  const unit = (Array.isArray(found) ? found : [found])[0];
  if (!unit) return reply({ kind: "inspect", id, ready: false });

  const batchCost = unit.upgradeCosts
    ? unit.upgradeCosts[count - 1]
    : unit.cost * BigInt(count);
  const units = player.units(unitType).map((owned) => ({
    id: owned.id(),
    level: owned.level(),
  }));
  reply({
    kind: "inspect",
    id,
    ready: true,
    valid: true,
    worldX: world.x,
    worldY: world.y,
    canBuild: unit.canBuild !== false,
    canUpgrade: unit.canUpgrade !== false,
    targetUnitId: unit.canUpgrade === false ? null : unit.canUpgrade,
    units,
    cost: String(unit.cost),
    batchCost: batchCost === undefined ? null : String(batchCost),
    gold: String(player.gold()),
    readyMissiles: usesMissile ? player.readyMissileCount() : null,
  });
};

const project = async ({ id, worldX, worldY }) => {
  const element = document.querySelector("build-menu");
  const game = element?.game;
  const transform = element?.transformHandler;
  if (!game || !transform) {
    return reply({ kind: "project", id, ready: false });
  }
  if (!game.isValidCoord(worldX, worldY)) {
    return reply({ kind: "project", id, ready: true, valid: false });
  }
  const screen = transform.worldToScreenCoordinates({
    x: worldX + 0.5,
    y: worldY + 0.5,
  });
  reply({
    kind: "project",
    id,
    ready: true,
    valid: true,
    screenX: screen.x,
    screenY: screen.y,
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

const troops = async ({ id }) => {
  const element = document.querySelector("build-menu");
  const game = element?.game;
  const player = game?.myPlayer?.();
  const config = game?.config?.();
  if (!player || !config) return reply({ kind: "troops", id, ready: false });

  const current = player.troops();
  const max = config.maxTroops(player);
  const increasePerSecond = config.troopIncreaseRate(player) * 10;
  if (![current, max, increasePerSecond].every(Number.isFinite) || max <= 0) {
    return reply({ kind: "troops", id, ready: false });
  }

  reply({
    kind: "troops",
    id,
    ready: true,
    troops: current,
    maxTroops: max,
    increasePerSecond,
  });
};

window.addEventListener(REQUEST, (event) => {
  const request = JSON.parse(event.detail);
  const kind = request.kind ?? "inspect";
  const handler =
    kind === "quote"
      ? quote
      : kind === "project"
        ? project
        : kind === "troops"
          ? troops
          : inspect;
  handler(request).catch(() => reply({ kind, id: request.id, ready: false }));
});

document.documentElement.dataset.auramaxxingBridge = "1";
