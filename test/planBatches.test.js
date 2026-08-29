import assert from "node:assert/strict";
import { BUILDABLES, BUILD_ACTIONS } from "../src/api/buildables.js";
import {
  batchAffordable,
  confirmedBatchAmount,
  parseCount,
  planBatches,
} from "../src/features/buildMaxxing.js";

const total = (batches) => batches.reduce((sum, size) => sum + size, 0);

assert.equal(BUILD_ACTIONS.includes("buildDefensePost"), true);
assert.deepEqual(BUILDABLES.buildDefensePost, {
  key: "Digit4",
  unitType: "Defense Post",
  batching: "none",
  repeatable: false,
});

assert.deepEqual(planBatches("buildWarship", 12, true), Array(12).fill(1));
assert.deepEqual(planBatches("buildCity", 12, true), [1, 5, 5, 1]);
assert.deepEqual(planBatches("buildCity", 12, false), [5, 5, 1, 1]);
assert.deepEqual(planBatches("buildAtomBomb", 12, true), [5, 5, 1, 1]);
assert.deepEqual(planBatches("buildCity", 1, true), [1]);

assert.equal(parseCount("5"), 5);
assert.equal(parseCount("2.5"), null);
assert.equal(parseCount("0"), null);
assert.equal(parseCount("Infinity"), null);

const escalatingBatch = {
  gold: "1500000",
  batchCost: "1875000",
  readyMissiles: null,
};
assert.equal(batchAffordable(escalatingBatch, "buildCity", 5), false);
assert.equal(
  batchAffordable({ ...escalatingBatch, gold: "1875000" }, "buildCity", 5),
  true,
);

const units = (...pairs) => pairs.map(([id, level]) => ({ id, level }));

assert.equal(
  confirmedBatchAmount(
    { targetUnitId: 7, units: units([7, 3]), readyMissiles: null },
    { targetUnitId: 7, units: units([7, 8]), readyMissiles: null },
    "buildCity",
  ),
  5,
);
assert.equal(
  confirmedBatchAmount(
    { targetUnitId: 7, units: units([7, 3]), readyMissiles: null },
    { targetUnitId: null, units: [], readyMissiles: null },
    "buildCity",
  ),
  0,
);
assert.equal(
  confirmedBatchAmount(
    { targetUnitId: null, units: units([2, 1]), readyMissiles: null },
    {
      targetUnitId: null,
      units: units([2, 1], [9, 1]),
      readyMissiles: null,
    },
    "buildWarship",
  ),
  1,
);
assert.equal(
  confirmedBatchAmount(
    { targetUnitId: null, units: [], readyMissiles: 8 },
    { targetUnitId: null, units: [], readyMissiles: 3 },
    "buildAtomBomb",
  ),
  5,
);
assert.equal(
  batchAffordable(
    { gold: "3750000", batchCost: "3750000", readyMissiles: 4 },
    "buildAtomBomb",
    5,
  ),
  false,
);
assert.equal(
  batchAffordable(
    { gold: "3750000", batchCost: "3750000", readyMissiles: 5 },
    "buildAtomBomb",
    5,
  ),
  true,
);
assert.equal(
  batchAffordable(
    { gold: "5000000", batchCost: "5000000", readyMissiles: 0 },
    "buildHydrogenBomb",
    1,
  ),
  false,
);
assert.equal(
  batchAffordable(
    { gold: "25000000", batchCost: "25000000", readyMissiles: 1 },
    "buildMIRV",
    1,
  ),
  true,
);

for (const action of ["buildCity", "buildWarship", "buildAtomBomb"]) {
  for (const firstIsBuild of [true, false]) {
    for (let count = 1; count <= 30; count++) {
      assert.equal(
        total(planBatches(action, count, firstIsBuild)),
        count,
        `${action} ${count} ${firstIsBuild}`,
      );
    }
  }
}

console.log("planBatches ok");
