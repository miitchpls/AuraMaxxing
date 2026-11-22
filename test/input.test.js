import assert from "node:assert/strict";

let stored = "{}";
const sent = [];

globalThis.localStorage = {
  getItem: () => stored,
};
globalThis.KeyboardEvent = class {
  constructor(type, init) {
    this.type = type;
    Object.assign(this, init);
  }
};
globalThis.MouseEvent = class {
  constructor(type, init) {
    this.type = type;
    Object.assign(this, init);
  }
};
const listeners = new Map();
globalThis.window = {
  dispatchEvent: (event) => {
    sent.push(event);
    return true;
  },
  addEventListener: (type, listener) => listeners.set(type, listener),
  removeEventListener: (type, listener) => {
    if (listeners.get(type) === listener) listeners.delete(type);
  },
};

const { pinCursor, pressBuildKey } = await import("../src/api/input.js");

stored = JSON.stringify({ buildCity: { value: "Null" } });
assert.equal(pressBuildKey("buildCity"), false);
assert.deepEqual(sent, []);

stored = "{}";
assert.equal(pressBuildKey("buildCity"), true);
assert.deepEqual(
  sent.map(({ type, code, shiftKey }) => ({ type, code, shiftKey })),
  [
    { type: "keydown", code: "Digit1", shiftKey: false },
    { type: "keyup", code: "Digit1", shiftKey: false },
  ],
);

sent.length = 0;
stored = JSON.stringify({ buildCity: { value: "Shift+KeyC" } });
assert.equal(pressBuildKey("buildCity"), true);
assert.deepEqual(
  sent.map(({ type, code, shiftKey }) => ({ type, code, shiftKey })),
  [
    { type: "keydown", code: "KeyC", shiftKey: true },
    { type: "keyup", code: "KeyC", shiftKey: true },
  ],
);

sent.length = 0;
const cursor = pinCursor(10, 20);
cursor.move(30, 40);
cursor.release();
assert.deepEqual(
  sent.map(({ type, clientX, clientY }) => ({ type, clientX, clientY })),
  [
    { type: "mousemove", clientX: 10, clientY: 20 },
    { type: "mousemove", clientX: 30, clientY: 40 },
  ],
);
assert.equal(listeners.has("mousemove"), false);

console.log("input ok");

const { pickMapPoint } = await import("../src/api/input.js");
const event = (x, y) => ({
  target: { tagName: "CANVAS" },
  button: 0,
  pointerId: 1,
  clientX: x,
  clientY: y,
  stopImmediatePropagation() {},
  preventDefault() {},
});
const picked = pickMapPoint({});
listeners.get("pointerdown")(event(10, 20));
listeners.get("pointerup")(event(11, 20));
assert.deepEqual(await picked, { x: 11, y: 20 });
assert.equal(listeners.size, 0);
const controller = new AbortController();
const cancelled = pickMapPoint({ signal: controller.signal });
controller.abort();
assert.equal(await cancelled, null);
assert.equal(listeners.size, 0);

const overlayPick = pickMapPoint({});
const overlayEvent = {
  ...event(40, 50),
  target: { tagName: "DIV", id: "game-input-overlay" },
};
listeners.get("pointerdown")(overlayEvent);
listeners.get("pointerup")(overlayEvent);
assert.deepEqual(await overlayPick, { x: 40, y: 50 });
assert.equal(listeners.size, 0);

const { captureBuildKeys } = await import("../src/api/input.js");
const presses = [];
const release = captureBuildKeys((...args) => presses.push(args));
const key = (type, code, extra = {}) => {
  const event = {
    type,
    code,
    isTrusted: true,
    shiftKey: false,
    target: { tagName: "CANVAS" },
    stopped: false,
    preventDefault() {},
    stopImmediatePropagation() {
      this.stopped = true;
    },
    ...extra,
  };
  listeners.get(type)(event);
  return event;
};
stored = "{}";
listeners.get("pointermove")({ clientX: 300, clientY: 400 });
assert.equal(key("keydown", "Digit4").stopped, true);
assert.equal(key("keyup", "Digit4").stopped, true);
assert.equal(key("keydown", "Numpad1").stopped, true);
assert.equal(key("keydown", "Digit4", { repeat: true }).stopped, true);
assert.equal(key("keydown", "Digit4", { shiftKey: true }).stopped, false);
assert.equal(key("keydown", "Digit4", { isTrusted: false }).stopped, false);
assert.equal(
  key("keydown", "Digit4", { target: { tagName: "INPUT" } }).stopped,
  false,
);
assert.equal(key("keydown", "KeyQ").stopped, false);
assert.deepEqual(presses, [
  ["buildDefensePost", 300, 400],
  ["buildCity", 300, 400],
]);
release();
assert.equal(listeners.size, 0);

console.log("captureBuildKeys ok");
