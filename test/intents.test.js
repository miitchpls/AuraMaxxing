import assert from "node:assert/strict";
import { nextSlotDelay, pickNext, rankOf } from "../src/api/intents.js";

const now = 1_000_000;

assert.equal(nextSlotDelay([], now), 0);
assert.equal(nextSlotDelay([now - 900, now - 800], now), 0);

// Five in the last second is the per-second budget: wait out the oldest.
const burst = [now - 900, now - 800, now - 700, now - 600, now - 500];
assert.equal(nextSlotDelay(burst, now), 100);

// Spread over the minute, the per-second budget is free again.
const spread = Array.from({ length: 99 }, (_, i) => now - 59_000 + i * 500);
assert.equal(nextSlotDelay(spread, now), 0);

// One hundred in the minute is the per-minute budget.
const full = Array.from({ length: 100 }, (_, i) => now - 59_000 + i * 500);
assert.equal(nextSlotDelay(full, now), 1000);

const priority = ["secretaryMaxxing", "buildMaxxing"];

assert.equal(rankOf("secretaryMaxxing", priority), 0);
assert.equal(rankOf("buildMaxxing", priority), 1);
assert.equal(rankOf("hippieMaxxing", priority), 2);

const entry = (featureId, seq) => ({ featureId, seq });

// The array's order wins over arrival order.
assert.equal(
  pickNext([entry("buildMaxxing", 0), entry("secretaryMaxxing", 1)], priority),
  1,
);

// A listed feature beats an unlisted one that arrived first.
assert.equal(
  pickNext([entry("hippieMaxxing", 0), entry("buildMaxxing", 1)], priority),
  1,
);

// Unlisted features fall back to arrival order among themselves.
assert.equal(
  pickNext([entry("wakeMaxxing", 5), entry("hippieMaxxing", 2)], priority),
  1,
);

// Same feature: first in, first out.
assert.equal(
  pickNext([entry("buildMaxxing", 7), entry("buildMaxxing", 3)], priority),
  1,
);

assert.equal(pickNext([], priority), -1);

console.log("intents ok");
