import assert from "node:assert/strict";
import { planBatches } from "../src/features/buildMaxxing.js";

const total = (batches) => batches.reduce((sum, size) => sum + size, 0);

assert.deepEqual(planBatches("buildWarship", 12), Array(12).fill(1));
assert.deepEqual(planBatches("buildCity", 12), [1, 5, 5, 1]);
assert.deepEqual(planBatches("buildAtomBomb", 12), [5, 5, 1, 1]);
assert.deepEqual(planBatches("buildCity", 1), [1]);

for (const action of ["buildCity", "buildWarship", "buildAtomBomb"]) {
  for (let count = 1; count <= 30; count++) {
    assert.equal(total(planBatches(action, count)), count, `${action} ${count}`);
  }
}

console.log("planBatches ok");
