import assert from "node:assert/strict";
import { nextSlotDelay, pickNext, rankOf } from "../src/api/intents.js";

const now = 1_000_000;

assert.equal(nextSlotDelay([], now), 0);
assert.equal(nextSlotDelay([now - 900, now - 800], now), 0);

const burst = Array.from({ length: 10 }, (_, i) => now - 900 + i * 90);
assert.equal(nextSlotDelay(burst.slice(0, 9), now), 0);
assert.equal(nextSlotDelay(burst, now), 100);
assert.equal(nextSlotDelay(burst, now + 100), 0);

// Spread over the minute, the per-second budget is free again.
const spread = Array.from({ length: 149 }, (_, i) => now - 59_000 + i * 380);
assert.equal(nextSlotDelay(spread, now), 0);

const full = Array.from({ length: 150 }, (_, i) => now - 59_000 + i * 380);
assert.equal(nextSlotDelay(full, now), 1000);
assert.equal(nextSlotDelay(full.slice(1), now + 1000), 0);

const sent = [];
let clock = 0;
for (let i = 0; i < 300; i++) {
  let delay;
  do {
    while (sent.length > 0 && clock - sent[0] >= 60_000) sent.shift();
    delay = nextSlotDelay(sent, clock);
    clock += delay;
  } while (delay > 0);
  sent.push(clock);
  assert.ok(sent.filter((time) => clock - time < 1000).length <= 10);
  assert.ok(sent.length <= 150);
  if (i === 9) assert.equal(clock, 0);
  if (i === 10) assert.equal(clock, 1000);
  if (i === 149) assert.equal(clock, 14_000);
  if (i === 150) assert.equal(clock, 60_000);
}
assert.equal(clock, 74_000);

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
