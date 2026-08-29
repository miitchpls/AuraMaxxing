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
const player = {
  buildables: async () => buildables,
  units: () => ownedUnits,
  gold: () => 4000000n,
  readyMissileCount: () => 4,
};
const game = {
  myPlayer: () => player,
  isValidCoord: () => true,
  ref: (x, y) => {
    lastRef = { x, y };
    return {};
  },
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

console.log("gameBridge ok");
