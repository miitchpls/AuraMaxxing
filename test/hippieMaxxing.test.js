import assert from "node:assert/strict";
import {
  actionKey,
  actionReady,
} from "../src/features/hippieMaxxing.js";

const action = { type: "request", recipient: "player-one" };

assert.equal(
  actionKey(action),
  "request:player-one",
);
assert.equal(
  actionKey({ type: "extension", recipient: "player-one" }),
  "extension:player-one",
);

const pending = new Map();
const lastAttempt = new Map();
assert.equal(actionReady(action, pending, lastAttempt, 10_000), true);

pending.set(actionKey(action), Promise.resolve());
assert.equal(actionReady(action, pending, lastAttempt, 10_000), false);

pending.clear();
lastAttempt.set(actionKey(action), 8_000);
assert.equal(actionReady(action, pending, lastAttempt, 10_000), false);
assert.equal(actionReady(action, pending, lastAttempt, 13_000), true);

console.log("hippieMaxxing ok");
