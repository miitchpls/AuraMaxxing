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
globalThis.window = {
  dispatchEvent: (event) => {
    sent.push(event);
    return true;
  },
};

const { pressBuildKey } = await import("../src/api/input.js");

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

console.log("input ok");
