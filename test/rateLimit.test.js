import assert from "node:assert/strict";
import { nextSlotDelay } from "../src/api/rateLimit.js";

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

console.log("rateLimit ok");
