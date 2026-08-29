import assert from "node:assert/strict";

import {
  peakTroopPlan,
  peakTroopTarget,
  troopIncreaseRateAt,
} from "../src/api/game.js";

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
assert.equal(surplus.targetRatio, target / maxTroops);
assert.ok(60000 * (1 - surplus.attackPercent / 100) >= target);
assert.ok(60000 * (1 - (surplus.attackPercent + 1) / 100) < target);
assert.equal(peakTroopPlan(40000, maxTroops).attackPercent, 0);
assert.equal(peakTroopPlan(-1, maxTroops), null);
assert.equal(peakTroopTarget(0), null);

console.log("peakTroops ok");
