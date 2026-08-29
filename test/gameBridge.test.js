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
const player = {
  buildables: async () => buildables,
  gold: () => 4000000n,
  readyMissileCount: () => 4,
};
const game = {
  myPlayer: () => player,
  isValidCoord: () => true,
  ref: () => ({}),
};
globalThis.document = {
  documentElement: { dataset: {} },
  querySelector: () => ({
    game,
    transformHandler: {
      screenToWorldCoordinates: () => ({ x: 1, y: 1 }),
    },
  }),
};

await import("../src/world/gameBridge.js");

let nextId = 0;
const inspect = (unitType, count) =>
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
          kind: "inspect",
          id,
          screenX: 10,
          screenY: 20,
          unitType,
          count,
        }),
      }),
    );
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
const upgrade = await inspect("City", 5);
assert.equal(upgrade.batchCost, "3500000");
assert.equal(upgrade.canBuild, false);
assert.equal(upgrade.canUpgrade, true);

buildables = [
  {
    canBuild: 1,
    canUpgrade: false,
    cost: 750000n,
  },
];
const atomBombs = await inspect("Atom Bomb", 5);
assert.equal(atomBombs.batchCost, "3750000");
assert.equal(atomBombs.readyMissiles, 4);

console.log("gameBridge ok");
