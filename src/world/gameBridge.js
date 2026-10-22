const REQUEST = "auramaxxing:game-request";
const RESPONSE = "auramaxxing:game-response";
const ALLIANCE_PLAYER_TYPES = new Set(["HUMAN", "NATION"]);

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
    upgradeCosts: unit.upgradeCosts ? unit.upgradeCosts.map(String) : null,
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

// The extension cannot import constructors from the game's bundle, but the bus
// keeps the exact runtime constructor identities registered by its transport.
const findEventType = (eventBus, constructorName, transportHandler) => {
  if (!(eventBus?.listeners instanceof Map)) return null;
  for (const [type, listeners] of eventBus.listeners) {
    if (type.name === constructorName) return type;
    if (
      listeners.some((listener) =>
        Function.prototype.toString.call(listener).includes(transportHandler),
      )
    ) {
      return type;
    }
  }
  return null;
};

const allianceContext = () => {
  const element = document.querySelector("build-menu");
  const game = element?.game;
  const eventBus = element?.eventBus;
  const player = game?.myPlayer?.();
  if (!game || !eventBus || !player) return null;

  const requestType = findEventType(
    eventBus,
    "SendAllianceRequestIntentEvent",
    "onSendAllianceRequest",
  );
  const extensionType = findEventType(
    eventBus,
    "SendAllianceExtensionIntentEvent",
    "onSendAllianceExtensionIntent",
  );
  if (!requestType || !extensionType) return null;
  return { game, eventBus, player, requestType, extensionType };
};

const playerTile = async (game, player) => {
  const location = player.nameLocation?.();
  if (
    location &&
    game.isValidCoord(location.x, location.y) &&
    game.owner(game.ref(location.x, location.y))?.id?.() === player.id()
  ) {
    return game.ref(location.x, location.y);
  }
  const borders = await player.borderTiles?.();
  return borders?.borderTiles?.values().next().value ?? null;
};

const interactionWith = async (game, player, other) => {
  const tile = await playerTile(game, other);
  if (tile === null) return null;
  const actions = await player.actions(tile, null);
  return actions?.interaction ?? null;
};

const allianceState = async ({ id }) => {
  const context = allianceContext();
  if (!context || !context.player.isAlive()) {
    return reply({ kind: "allianceState", id, ready: false });
  }

  const { game, player } = context;
  const candidates = game
    .players()
    .filter((other) => {
      const allied = player.isAlliedWith(other);
      return (
        other !== player &&
        ALLIANCE_PLAYER_TYPES.has(other.type?.()) &&
        other.isAlive() &&
        !other.isDisconnected() &&
        (!player.isFriendly(other) || allied) &&
        !player.isRequestingAllianceWith(other)
      );
    });

  const actions = await Promise.all(
    candidates.map(async (other) => {
      try {
        const interaction = await interactionWith(game, player, other);
        if (interaction?.canSendAllianceRequest) {
          return { type: "request", recipient: other.id() };
        }
        if (interaction?.allianceInfo?.canExtend) {
          return { type: "extension", recipient: other.id() };
        }
      } catch {
        return null;
      }
      return null;
    }),
  );

  reply({
    kind: "allianceState",
    id,
    ready: true,
    actions: actions.filter((action) => action !== null),
  });
};

const cancelledAllianceActions = new Set();

const allianceCancel = async ({ id, token }) => {
  if (typeof token === "string") cancelledAllianceActions.add(token);
  reply({ kind: "allianceCancel", id, ready: true });
};

const allianceAction = async ({ id, action, recipient, token }) => {
  const context = allianceContext();
  if (!context || !context.player.isAlive()) {
    return reply({ kind: "allianceAction", id, ready: false, sent: false });
  }

  const { game, eventBus, player, requestType, extensionType } = context;
  const other = game.players().find((candidate) => candidate.id() === recipient);
  if (
    !other ||
    other === player ||
    !ALLIANCE_PLAYER_TYPES.has(other.type?.())
  ) {
    return reply({ kind: "allianceAction", id, ready: true, sent: false });
  }

  const interaction = await interactionWith(game, player, other);
  if (cancelledAllianceActions.delete(token)) {
    return reply({ kind: "allianceAction", id, ready: true, sent: false });
  }
  if (action === "request" && interaction?.canSendAllianceRequest) {
    eventBus.emit(new requestType(player, other));
    return reply({ kind: "allianceAction", id, ready: true, sent: true });
  }
  if (action === "extension" && interaction?.allianceInfo?.canExtend) {
    eventBus.emit(new extensionType(other));
    return reply({ kind: "allianceAction", id, ready: true, sent: true });
  }
  reply({ kind: "allianceAction", id, ready: true, sent: false });
};

const upgrade = async ({ id, unitId, unitType, amount }) => {
  const element = document.querySelector("build-menu");
  const eventBus = element?.eventBus;
  const player = element?.game?.myPlayer?.();
  const upgradeType = findEventType(
    eventBus,
    "SendUpgradeStructureIntentEvent",
    "onSendUpgradeStructureIntent",
  );
  if (!player || !upgradeType) {
    return reply({ kind: "upgrade", id, ready: false, sent: false });
  }
  eventBus.emit(new upgradeType(unitId, unitType, amount));
  reply({ kind: "upgrade", id, ready: true, sent: true });
};

const handlers = {
  quote,
  upgrade,
  project,
  allianceState,
  allianceAction,
  allianceCancel,
};

window.addEventListener(REQUEST, (event) => {
  const request = JSON.parse(event.detail);
  const kind = request.kind ?? "inspect";
  const handler = Object.hasOwn(handlers, kind) ? handlers[kind] : inspect;
  handler(request).catch(() => {
    if (kind === "allianceAction") {
      cancelledAllianceActions.delete(request.token);
    }
    reply({ kind, id: request.id, ready: false });
  });
});

document.documentElement.dataset.auramaxxingBridge = "1";
