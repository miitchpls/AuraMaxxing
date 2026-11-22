const BUILD_MENU = "build-menu";
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
  const element = document.querySelector(BUILD_MENU);
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
  const element = document.querySelector(BUILD_MENU);
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
  const element = document.querySelector(BUILD_MENU);
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
  if (!player?.isAlive() || !config) {
    return reply({ kind: "troops", id, ready: false });
  }

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
  const element = document.querySelector(BUILD_MENU);
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
  const candidates = game.players().filter((other) => {
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
  const other = game
    .players()
    .find((candidate) => candidate.id() === recipient);
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
  const element = document.querySelector(BUILD_MENU);
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

const NUKES_WITH_DIRECTION = new Set(["Atom Bomb", "Hydrogen Bomb"]);

// Mirrors what the game does when its ghost structure is clicked: upgrade the
// nearby structure unless stacking prevention is held, otherwise build.
const flashBuild = async ({ id, screenX, screenY, unitType }) => {
  const element = document.querySelector(BUILD_MENU);
  const game = element?.game;
  const eventBus = element?.eventBus;
  const transform = element?.transformHandler;
  const player = game?.myPlayer?.();
  const buildType = findEventType(
    eventBus,
    "BuildUnitIntentEvent",
    "onBuildUnitIntent",
  );
  const upgradeType = findEventType(
    eventBus,
    "SendUpgradeStructureIntentEvent",
    "onSendUpgradeStructureIntent",
  );
  if (
    !player?.isAlive() ||
    game.inSpawnPhase() ||
    !transform ||
    !buildType ||
    !upgradeType
  ) {
    return reply({ kind: "flashBuild", id, ready: false, sent: false });
  }

  const world = transform.screenToWorldCoordinates(screenX, screenY);
  if (!world || !game.isValidCoord(world.x, world.y)) {
    return reply({ kind: "flashBuild", id, ready: true, sent: false });
  }
  const tile = game.ref(world.x, world.y);
  const found = await player.buildables(tile, [unitType]);
  const unit = (Array.isArray(found) ? found : [found])[0];
  const uiState = element.uiState;

  if (unit && unit.canUpgrade !== false && !uiState?.preventStacking) {
    eventBus.emit(new upgradeType(unit.canUpgrade, unitType, 1));
    return reply({ kind: "flashBuild", id, ready: true, sent: true });
  }
  if (unit && unit.canBuild !== false) {
    const rocketDirectionUp = NUKES_WITH_DIRECTION.has(unitType)
      ? (uiState?.rocketDirectionUp ?? true)
      : undefined;
    eventBus.emit(new buildType(unitType, tile, rocketDirectionUp));
    return reply({ kind: "flashBuild", id, ready: true, sent: true });
  }
  reply({ kind: "flashBuild", id, ready: true, sent: false });
};

const breachState = async ({
  id,
  screenX,
  screenY,
  worldX,
  worldY,
  onlyTarget = false,
}) => {
  const element = document.querySelector(BUILD_MENU);
  const game = element?.game;
  const player = game?.myPlayer?.();
  const config = game?.config?.();
  const required = [
    "nukeSpeed",
    "SAMCooldown",
    "SiloCooldown",
    "samRange",
    "maxSamRange",
    "defaultSamMissileSpeed",
    "defaultNukeTargetableRange",
    "msPerTick",
    "structureMinDist",
    "samUpgradeDuration",
  ];
  if (
    !player ||
    !config ||
    required.some((name) => typeof config[name] !== "function")
  ) {
    return reply({ kind: "breachState", id, ready: false });
  }
  const target =
    Number.isInteger(worldX) && Number.isInteger(worldY)
      ? { x: worldX, y: worldY }
      : element.transformHandler?.screenToWorldCoordinates(screenX, screenY);
  if (!target || !game.isValidCoord(target.x, target.y)) {
    return reply({ kind: "breachState", id, ready: true, valid: false });
  }
  const targetTile = game.ref(target.x, target.y);
  const targetOwner = game.hasOwner(targetTile) ? game.owner(targetTile) : null;
  const tick = game.ticks();
  const serialize = (unit) => ({
    id: unit.id(),
    x: game.x(unit.tile()),
    y: game.y(unit.tile()),
    level: unit.level(),
    underConstruction: unit.isUnderConstruction(),
    queue: unit.missileTimerQueue().map((t) => t - tick),
  });
  const sams = game
    .units("SAM Launcher")
    .filter(
      (unit) =>
        unit.isActive() &&
        !unit.isUnderConstruction() &&
        unit.owner() !== player &&
        !unit.owner().isOnSameTeam(player) &&
        (!onlyTarget || unit.owner() === targetOwner),
    )
    .map((unit) => {
      const state = unit.state;
      const upgrading =
        state?.samUpgradeStartTick !== null &&
        state?.samUpgradeStartTick !== undefined;
      return {
        ...serialize(unit),
        range: config.samRange(unit.level()),
        upgrade: upgrading
          ? {
              start: state.samUpgradeStartTick - tick,
              end:
                state.samUpgradeStartTick +
                (state.samUpgradeDuration ?? config.samUpgradeDuration()) -
                tick,
              from: state.samUpgradeStartRange,
            }
          : null,
      };
    });
  const silos = player
    .units("Missile Silo")
    .filter((unit) => unit.isActive())
    .map(serialize);
  const [bombQuote, siloQuote] = await Promise.all([
    player.buildables(targetTile, ["Atom Bomb"]),
    player.buildables(
      silos.length ? game.ref(silos[0].x, silos[0].y) : targetTile,
      ["Missile Silo"],
    ),
  ]);
  const buildable = (Array.isArray(bombQuote) ? bombQuote : [bombQuote])[0];
  const siloBuildable = (Array.isArray(siloQuote) ? siloQuote : [siloQuote])[0];
  const buildSites = [];
  const anchor = [...silos].sort(
    (a, b) =>
      Math.abs(a.x - target.x) +
      Math.abs(a.y - target.y) -
      Math.abs(b.x - target.x) -
      Math.abs(b.y - target.y),
  )[0];
  if (anchor) {
    const spacing = config.structureMinDist() + 1;
    const structures = game
      .units(
        "City",
        "Defense Post",
        "SAM Launcher",
        "Missile Silo",
        "Port",
        "Factory",
      )
      .map((u) => ({ x: game.x(u.tile()), y: game.y(u.tile()) }));
    for (let ring = 1; ring <= 5 && buildSites.length < 4; ring++) {
      for (let dx = -ring; dx <= ring && buildSites.length < 4; dx++)
        for (let dy = -ring; dy <= ring && buildSites.length < 4; dy++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue;
          const p = { x: anchor.x + dx * spacing, y: anchor.y + dy * spacing };
          if (!game.isValidCoord(p.x, p.y)) continue;
          const tile = game.ref(p.x, p.y);
          if (
            game.owner(tile) !== player ||
            !game.isLand(tile) ||
            game.isImpassable(tile)
          )
            continue;
          if (
            [...structures, ...buildSites].some(
              (u) =>
                (p.x - u.x) ** 2 + (p.y - u.y) ** 2 <
                config.structureMinDist() ** 2,
            )
          )
            continue;
          buildSites.push(p);
        }
    }
  }
  reply({
    kind: "breachState",
    id,
    ready: true,
    valid: true,
    tick,
    target,
    sams,
    silos,
    gold: String(player.gold()),
    bombCost: buildable ? String(buildable.cost) : null,
    siloCost: siloBuildable ? String(siloBuildable.cost) : null,
    buildSites,
    canLaunch: Boolean(buildable) && buildable.canBuild !== false,
    protectedTarget:
      targetOwner !== null &&
      (targetOwner === player || targetOwner.isOnSameTeam(player)),
    inFlight: game.units("Atom Bomb", "Hydrogen Bomb", "MIRV", "MIRV Warhead")
      .length,
    rules: {
      height: game.height(),
      width: game.width(),
      msPerTick: config.msPerTick(),
      nukeSpeed: config.nukeSpeed("Atom Bomb"),
      targetableRange: config.defaultNukeTargetableRange(),
      samCooldown: config.SAMCooldown(),
      siloCooldown: config.SiloCooldown(),
      samSpeed: config.defaultSamMissileSpeed(),
      maxSamRange: config.maxSamRange(),
      structureSpacing: config.structureMinDist() + 1,
    },
  });
};

const handlers = {
  breachState,
  quote,
  upgrade,
  flashBuild,
  project,
  troops,
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
