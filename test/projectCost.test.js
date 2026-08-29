import assert from "node:assert/strict";
import { projectCost } from "../src/api/game.js";

const CITY_BASE = 125000n;
assert.equal(projectCost("City", CITY_BASE, 1), 125000n);
assert.equal(projectCost("City", CITY_BASE, 2), 375000n);
assert.equal(projectCost("City", CITY_BASE, 3), 875000n);
assert.equal(projectCost("City", CITY_BASE, 10), 7875000n);

assert.equal(projectCost("Warship", 250000n, 3), 1500000n);
// 250k + 500k + 750k, then the 1M cap holds for the rest.
assert.equal(projectCost("Warship", 250000n, 6), 4500000n);

assert.equal(projectCost("Defense Post", 50000n, 5), 750000n);
assert.equal(projectCost("Defense Post", 200000n, 3), 700000n);
assert.equal(projectCost("SAM Launcher", 1500000n, 4), 10500000n);
assert.equal(projectCost("MIRV", 25000000n, 3), 120000000n);
assert.equal(projectCost("MIRV", 55000000n, 2), 125000000n);

// A flat price must not be dragged down to the escalating types' cap.
assert.equal(projectCost("Hydrogen Bomb", 5000000n, 5), 25000000n);
assert.equal(projectCost("Atom Bomb", 750000n, 4), 3000000n);
assert.equal(projectCost("Missile Silo", 1000000n, 2), 2000000n);

console.log("projectCost ok");
