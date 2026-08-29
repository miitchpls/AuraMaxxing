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
