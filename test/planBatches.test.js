import assert from "node:assert/strict";
import {
  batchAffordable,
  parseCount,
  planBatches,
} from "../src/features/buildMaxxing.js";

const total = (batches) => batches.reduce((sum, size) => sum + size, 0);

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
