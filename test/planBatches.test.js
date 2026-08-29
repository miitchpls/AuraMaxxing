import assert from "node:assert/strict";
import { planBatches } from "../src/features/buildMaxxing.js";

const total = (batches) => batches.reduce((sum, size) => sum + size, 0);

assert.deepEqual(planBatches("buildWarship", 12, true), Array(12).fill(1));
assert.deepEqual(planBatches("buildCity", 12, true), [1, 5, 5, 1]);
assert.deepEqual(planBatches("buildCity", 12, false), [5, 5, 1, 1]);
assert.deepEqual(planBatches("buildAtomBomb", 12, true), [5, 5, 1, 1]);
assert.deepEqual(planBatches("buildCity", 1, true), [1]);

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
