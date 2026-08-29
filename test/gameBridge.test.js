import assert from "node:assert/strict";

const REQUEST = "auramaxxing:game-request";
const RESPONSE = "auramaxxing:game-response";

class TestCustomEvent extends Event {
  constructor(type, { detail }) {
    super(type);
    this.detail = detail;
  }
}

globalThis.CustomEvent = TestCustomEvent;
globalThis.window = new EventTarget();

let buildables = [];
let ownedUnits = [];
let screenWorld = { x: 1, y: 1 };
let projectOffset = 0;
let lastRef = null;
let allianceInteraction = { canSendAllianceRequest: true };
let allianceInteractionCalls = 0;
const emitted = [];
class SendAllianceRequestIntentEvent {
  constructor(requestor, recipient) {
    this.requestor = requestor;
    this.recipient = recipient;
  }
}
class SendAllianceExtensionIntentEvent {
  constructor(recipient) {
    this.recipient = recipient;
  }
}
const eventBus = {
  listeners: new Map([
    [SendAllianceRequestIntentEvent, [function onSendAllianceRequest() {}]],
    [
      SendAllianceExtensionIntentEvent,
      [function onSendAllianceExtensionIntent() {}],
    ],
  ]),
  emit: (event) => emitted.push(event),
};
const other = {
  id: () => "other-player",
  type: () => "HUMAN",
  isAlive: () => true,
  isDisconnected: () => false,
  nameLocation: () => ({ x: 2, y: 2 }),
};
const bot = {
  id: () => "bot-player",
  type: () => "BOT",
  isAlive: () => true,
  isDisconnected: () => false,
  nameLocation: () => ({ x: 3, y: 3 }),
};
const nation = {
  id: () => "nation-player",
  type: () => "NATION",
  isAlive: () => true,
  isDisconnected: () => false,
  nameLocation: () => ({ x: 4, y: 4 }),
};
const player = {
  buildables: async () => buildables,
  units: () => ownedUnits,
  gold: () => 4000000n,
  readyMissileCount: () => 4,
  id: () => "my-player",
  isAlive: () => true,
  isFriendly: () => false,
  isRequestingAllianceWith: () => false,
  isAlliedWith: () => false,
  alliances: () => [],
  actions: async () => {
    allianceInteractionCalls++;
    return { interaction: allianceInteraction };
  },
};
const game = {
  myPlayer: () => player,
  players: () => [player, other, bot, nation],
  isValidCoord: () => true,
  ref: (x, y) => {
    lastRef = { x, y };
    return { x, y };
  },
  owner: ({ x, y }) =>
    x === 2 && y === 2 ? other : x === 4 && y === 4 ? nation : player,
};
const transformHandler = {
  screenToWorldCoordinates: () => screenWorld,
  worldToScreenCoordinates: ({ x, y }) => ({
    x: x * 10 + projectOffset,
    y: y * 10 + projectOffset,
  }),
};
globalThis.document = {
  documentElement: { dataset: {} },
  querySelector: () => ({
    game,
    eventBus,
    transformHandler,
  }),
};

await import("../src/world/gameBridge.js");

let nextId = 0;
const request = (payload) =>
  new Promise((resolve) => {
    const id = ++nextId;
    const onResponse = (event) => {
      const response = JSON.parse(event.detail);
      if (response.id !== id) return;
      window.removeEventListener(RESPONSE, onResponse);
      resolve(response);
    };
    window.addEventListener(RESPONSE, onResponse);
    window.dispatchEvent(
      new CustomEvent(REQUEST, {
        detail: JSON.stringify({
          id,
          ...payload,
        }),
      }),
    );
  });

const inspect = (unitType, count, usesMissile = false, target = {}) =>
  request({
    kind: "inspect",
    screenX: 10,
    screenY: 20,
    unitType,
    usesMissile,
    count,
    ...target,
  });

assert.deepEqual(await inspect("City", 5), {
  kind: "inspect",
  id: 1,
  ready: false,
});

buildables = [
  {
    canBuild: false,
    canUpgrade: 1,
    cost: 250000n,
    upgradeCosts: [250000n, 750000n, 1500000n, 2500000n, 3500000n],
  },
];
ownedUnits = [
  { id: () => 1, level: () => 4 },
  { id: () => 2, level: () => 2 },
];
const upgrade = await inspect("City", 5);
assert.equal(upgrade.batchCost, "3500000");
assert.equal(upgrade.canBuild, false);
assert.equal(upgrade.canUpgrade, true);
assert.equal(upgrade.worldX, 1);
assert.equal(upgrade.worldY, 1);
assert.equal(upgrade.targetUnitId, 1);
assert.deepEqual(upgrade.units, [
  { id: 1, level: 4 },
  { id: 2, level: 2 },
]);

screenWorld = { x: 9, y: 9 };
const lockedWorld = await inspect("City", 1, false, {
  worldX: 1,
  worldY: 1,
});
assert.equal(lockedWorld.worldX, 1);
assert.equal(lockedWorld.worldY, 1);
assert.deepEqual(lastRef, { x: 1, y: 1 });

assert.deepEqual(await request({ kind: "project", worldX: 1, worldY: 1 }), {
  kind: "project",
  id: 4,
  ready: true,
  valid: true,
  screenX: 15,
  screenY: 15,
});
projectOffset = 100;
assert.deepEqual(await request({ kind: "project", worldX: 1, worldY: 1 }), {
  kind: "project",
  id: 5,
  ready: true,
  valid: true,
  screenX: 115,
  screenY: 115,
});

buildables = [
  {
    canBuild: 1,
    canUpgrade: false,
    cost: 750000n,
  },
];
ownedUnits = [];
const atomBombs = await inspect("Atom Bomb", 5, true);
assert.equal(atomBombs.batchCost, "3750000");
assert.equal(atomBombs.readyMissiles, 4);

assert.deepEqual(await request({ kind: "allianceState" }), {
  kind: "allianceState",
  id: 7,
  ready: true,
  actions: [
    { type: "request", recipient: "other-player" },
    { type: "request", recipient: "nation-player" },
  ],
});
assert.equal(allianceInteractionCalls, 2);

assert.deepEqual(
  await request({
    kind: "allianceAction",
    action: "request",
    recipient: "other-player",
    token: "request-action",
  }),
  { kind: "allianceAction", id: 8, ready: true, sent: true },
);
assert.equal(emitted[0] instanceof SendAllianceRequestIntentEvent, true);
assert.equal(emitted[0].recipient, other);

allianceInteraction = {
  canSendAllianceRequest: false,
  allianceInfo: { canExtend: true },
};
assert.deepEqual(
  await request({
    kind: "allianceAction",
    action: "extension",
    recipient: "other-player",
    token: "extension-action",
  }),
  { kind: "allianceAction", id: 9, ready: true, sent: true },
);
assert.equal(emitted[1] instanceof SendAllianceExtensionIntentEvent, true);
assert.equal(emitted[1].recipient, other);

let finishInteraction;
player.actions = () =>
  new Promise((resolve) => {
    finishInteraction = resolve;
  });
const cancelledAction = request({
  kind: "allianceAction",
  action: "extension",
  recipient: "other-player",
  token: "cancel-me",
});
assert.deepEqual(
  await request({ kind: "allianceCancel", token: "cancel-me" }),
  { kind: "allianceCancel", id: 11, ready: true },
);
finishInteraction({ interaction: allianceInteraction });
assert.deepEqual(await cancelledAction, {
  kind: "allianceAction",
  id: 10,
  ready: true,
  sent: false,
});
assert.equal(emitted.length, 2);

console.log("gameBridge ok");
