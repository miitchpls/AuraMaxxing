import assert from "node:assert/strict";

import {
  peakTroopPlan,
  peakTroopTarget,
  toDisplayedTroops,
  troopIncreaseRateAt,
} from "../src/api/game.js";
import {
  formatTroops,
  peakGaugePosition,
} from "../src/features/peakMaxxing.js";

const maxTroops = 100000;
const target = peakTroopTarget(maxTroops);

assert.ok(Math.abs(target - 41787.55696878479) < 0.000001);
assert.ok(
  troopIncreaseRateAt(target, maxTroops) >
    troopIncreaseRateAt(target - 100, maxTroops),
);
assert.ok(
  troopIncreaseRateAt(target, maxTroops) >
    troopIncreaseRateAt(target + 100, maxTroops),
);
assert.equal(troopIncreaseRateAt(maxTroops, maxTroops), 0);

const surplus = peakTroopPlan(60000, maxTroops);
assert.equal(surplus.attackPercent, 30);
assert.equal(surplus.targetTroops, target);
assert.ok(60000 * (1 - surplus.attackPercent / 100) >= target);
assert.ok(60000 * (1 - (surplus.attackPercent + 1) / 100) < target);
assert.equal(peakTroopPlan(40000, maxTroops).attackPercent, 0);
assert.equal(peakTroopPlan(-1, maxTroops), null);
assert.equal(peakTroopTarget(0), null);

assert.equal(peakGaugePosition(0.92, 40000, 50000), 46);
assert.equal(peakGaugePosition(0.92, 60000, 50000), 54);
assert.equal(peakGaugePosition(1, 50000, 50000), 50);
assert.equal(peakGaugePosition(0, 40000, 50000), 0);
assert.equal(peakGaugePosition(0, 60000, 50000), 100);

assert.equal(toDisplayedTroops(85900), 8590);
assert.equal(formatTroops(85900), "8.59K");

console.log("peakTroops ok");
