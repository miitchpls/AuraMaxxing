import assert from "node:assert/strict";
import {
  calculate,
  makeSalvo,
  simulate,
  trajectory,
} from "../src/api/breachModel.js";

const snapshot = {
  bombCost: "750000",
  siloCost: "1000000",
  buildSites: [
    { x: 200, y: 432 },
    { x: 200, y: 448 },
    { x: 200, y: 464 },
  ],
  rules: {
    width: 1200,
    height: 800,
    msPerTick: 100,
    nukeSpeed: 10,
    targetableRange: 150,
    siloCooldown: 90,
    samCooldown: 90,
    samSpeed: 12,
    maxSamRange: 150,
    structureSpacing: 16,
  },
  target: { x: 800, y: 400 },
  silos: [50, 51].map((level, i) => ({
    id: i + 1,
    x: 200,
    y: 400 + 12 * i,
    level,
    queue: [],
  })),
  sams: [
    { id: 3, x: 800, y: 400, level: 100, range: 150 - 480 / 105, queue: [] },
  ],
};
const run = (s, count, gap = 1) =>
  simulate(s, makeSalvo(s, s.silos, count, gap));
assert.equal(run(snapshot, 101).breached, false);
assert.equal(run(snapshot, 101, 0).breached, true);
assert.equal(
  run({ ...snapshot, silos: [{ ...snapshot.silos[0], level: 101 }] }, 101)
    .breached,
  false,
);
assert.equal(
  run(
    { ...snapshot, silos: snapshot.silos.map((s) => ({ ...s, x: 600 })) },
    101,
  ).breached,
  true,
);
assert.equal(run({ ...snapshot, sams: [] }, 1).breached, true);
assert.equal(
  run(
    {
      ...snapshot,
      sams: [
        snapshot.sams[0],
        { id: 4, x: 820, y: 400, level: 1, range: 70, queue: [] },
      ],
    },
    101,
    0,
  ).breached,
  false,
);
assert.equal(
  run(
    {
      ...snapshot,
      sams: [
        snapshot.sams[0],
        { id: 4, x: 1000, y: 400, level: 1, range: 70, queue: [] },
      ],
    },
    101,
    0,
  ).breached,
  true,
);
const salvo = makeSalvo(snapshot, snapshot.silos, 101);
assert.equal(salvo[0].firstMotion, 3);
assert.equal(salvo[50].firstMotion, 13);
assert.equal(salvo.at(-1).firstMotion, 63);
const path = trajectory(snapshot.silos[0], snapshot.target, snapshot.rules);
assert.deepEqual({ x: path[0].x, y: path[0].y }, { x: 200, y: 400 });
assert.deepEqual({ x: path.at(-1).x, y: path.at(-1).y }, snapshot.target);
assert.ok(path.some((p) => !p.targetable));
assert.ok(
  trajectory({ x: 1, y: 1 }, { x: 1199, y: 1 }, snapshot.rules).every(
    (p) => p.y >= 0,
  ),
);
const result = await calculate(snapshot);
assert.deepEqual(result.plan.levels, [52, 51]);
assert.equal(result.plan.bombs, 103);
assert.equal(result.plan.orderSeconds, 2);
assert.equal(result.plan.cost, "77250000");
const fromOne = await calculate({
  ...snapshot,
  silos: [{ ...snapshot.silos[0], level: 1 }],
});
assert.deepEqual(fromOne.plan.levels, [34, 34, 33]);
assert.equal(fromOne.plan.bombs, 101);
assert.equal(fromOne.plan.cost, "75750000");
assert.deepEqual(await calculate({ ...snapshot, siloCost: null }), result);
assert.equal(
  (await calculate({ ...snapshot, bombCost: null })).status,
  "no-prices",
);
const depleted = {
  ...snapshot,
  sams: snapshot.sams.map((s) => ({
    ...s,
    queue: Array(100).fill(0),
    upgrade: { start: 0, end: 45, from: 70 },
  })),
};
assert.deepEqual(await calculate(depleted), result);
assert.equal(depleted.sams[0].queue.length, 100);
const arcChoice = await calculate({
  ...snapshot,
  sams: [{ id: 4, x: 300, y: 300, level: 1, range: 70, queue: [] }],
});
assert.equal(arcChoice.plan.bombs, 1);
assert.equal(arcChoice.plan.directionUp, false);
assert.equal((await calculate({ ...snapshot, silos: [] })).status, "no-silos");
await assert.rejects(calculate(snapshot, { signal: AbortSignal.abort() }), {
  name: "AbortError",
});
console.log("breachModel ok");
