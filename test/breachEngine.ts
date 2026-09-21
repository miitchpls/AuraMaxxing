import assert from "node:assert/strict";
import { Config } from "../../src/core/configuration/Config";
import { ConstructionExecution } from "../../src/core/execution/ConstructionExecution";
import { MissileSiloExecution } from "../../src/core/execution/MissileSiloExecution";
import { SAMLauncherExecution } from "../../src/core/execution/SAMLauncherExecution";
import { PlayerInfo, PlayerType, UnitType } from "../../src/core/game/Game";
import { createGame } from "../../src/core/game/GameImpl";
import { GameMapImpl } from "../../src/core/game/GameMap";
import { makeSalvo, simulate, trajectory } from "../src/api/breachModel.js";
console.debug = () => {};
export function runScenario(options: any) {
  const {
    levels = [50, 51],
    sams = [{ x: 800, y: 400, level: 100 }],
    count = 101,
    batch = 5,
    gap = 1,
    direction = true,
    distance = 600,
    siloSpacing = 12,
    siloPositions,
  } = options;
  const width = 1200,
    height = 800;
  const map = new GameMapImpl(
    width,
    height,
    new Uint8Array(width * height).fill(128 | 10),
    width * height,
  );
  const mini = new GameMapImpl(
    300,
    200,
    new Uint8Array(60000).fill(128 | 10),
    60000,
  );
  const cfg = new Config(
    {
      gameMap: "World",
      gameMapSize: "Normal",
      gameType: "Singleplayer",
      gameMode: "Free For All",
      difficulty: "Easy",
      nations: 0,
      bots: 0,
      infiniteGold: true,
      infiniteTroops: true,
      instantBuild: true,
      randomSpawn: false,
      spawnImmunityDuration: 0,
      disableNavMesh: true,
      waterNukes: false,
    } as any,
    null,
    false,
  );
  const game: any = createGame([], [], map, mini, cfg);
  game.endSpawnPhase();
  for (const [id, x, y] of [
    ["attacker", 800 - distance, 400],
    ["defender", 800, 400],
  ] as const) {
    game.addPlayer(new PlayerInfo(id, PlayerType.Human, null, id));
    const p = game.player(id);
    p.setSpawnTile(game.ref(x, y));
    for (let dx = -35; dx <= 35; dx++)
      for (let dy = -35; dy <= 35; dy++)
        if (game.isValidCoord(x + dx, y + dy))
          p.conquer(game.ref(x + dx, y + dy));
    p.addGold(1000000000000000000n);
    p.addTroops(1000000);
  }
  const attacker = game.player("attacker"),
    defender = game.player("defender");
  const silos = levels.map((level: number, index: number) => {
    const pos = siloPositions?.[index] ?? [
      800 - distance,
      400 + index * siloSpacing,
    ];
    const tile = game.ref(...pos);
    attacker.conquer(tile);
    const u = attacker.buildUnit(UnitType.MissileSilo, tile, {});
    for (let l = 1; l < level; l++) u.increaseLevel();
    game.addExecution(new MissileSiloExecution(u));
    return u;
  });
  const samUnits = sams.map((s: any) => {
    const tile = game.ref(s.x, s.y);
    defender.conquer(tile);
    const u = defender.buildUnit(UnitType.SAMLauncher, tile, {});
    for (let l = 1; l < s.level; l++) u.increaseLevel();
    game.addExecution(new SAMLauncherExecution(defender, null, u));
    return u;
  });
  for (let t = 0; t < 300; t++) game.executeNextTick();
  const rules = {
    height,
    width,
    nukeSpeed: cfg.nukeSpeed(UnitType.AtomBomb),
    samSpeed: cfg.defaultSamMissileSpeed(),
    samCooldown: cfg.SAMCooldown(),
    siloCooldown: cfg.SiloCooldown(),
    targetableRange: cfg.defaultNukeTargetableRange(),
    maxSamRange: cfg.maxSamRange(),
    msPerTick: cfg.msPerTick(),
    structureSpacing: 16,
  };
  const snapshot = {
    tick: game.ticks(),
    target: { x: 800, y: 400 },
    rules,
    silos: silos.map((u: any) => ({
      id: u.id(),
      x: game.x(u.tile()),
      y: game.y(u.tile()),
      level: u.level(),
      queue: [],
    })),
    sams: samUnits.map((u: any) => ({
      id: u.id(),
      x: game.x(u.tile()),
      y: game.y(u.tile()),
      level: u.level(),
      range: cfg.samRange(u.level()),
      queue: [],
    })),
  };
  const start = game.ticks();
  const events: any[] = [];
  const bombs = new Map();
  let landed = 0,
    intercepted = 0;
  const originalBuild = attacker.buildUnit.bind(attacker);
  attacker.buildUnit = (type: any, tile: any, params: any) => {
    const u = originalBuild(type, tile, params);
    if (type === UnitType.AtomBomb) {
      assert.deepEqual(
        trajectory(
          { x: game.x(tile), y: game.y(tile) },
          snapshot.target,
          rules,
          direction,
        ),
        u.trajectory().map((p: any) => ({
          x: game.x(p.tile),
          y: game.y(p.tile),
          targetable: p.targetable,
        })),
      );
      const row: any = {
        kind: "launch",
        tick: game.ticks() - start,
        id: u.id(),
        src: tile,
        x: game.x(tile),
        y: game.y(tile),
      };
      events.push(row);
      bombs.set(u.id(), { u, row });
    }
    return u;
  };
  const originalAdd = game.addExecution.bind(game);
  game.addExecution = (...execs: any[]) => {
    for (const e of execs)
      if (e.constructor.name === "SAMMissileExecution")
        events.push({
          kind: "sam",
          tick: game.ticks() - start,
          sam: e.ownerUnit.id(),
          target: e.target.id(),
          reloading: e.ownerUnit.missileTimerQueue().length,
        });
    return originalAdd(...execs);
  };
  const stats = game.stats();
  const originalLand = stats.bombLand.bind(stats);
  stats.bombLand = (...args: any[]) => {
    if (args[0] === attacker) {
      landed++;
      events.push({ kind: "impact", tick: game.ticks() - start });
    }
    return originalLand(...args);
  };
  const originalIntercept = stats.bombIntercept.bind(stats);
  stats.bombIntercept = (...args: any[]) => {
    intercepted += Number(args[2]);
    events.push({ kind: "intercept", tick: game.ticks() - start });
    return originalIntercept(...args);
  };
  let issued = 0,
    nextOrder = 0,
    orders = 0;
  const target = game.ref(800, 400);
  for (let t = 0; t < 1600; t++) {
    while (issued < count && t >= nextOrder) {
      const amount = Math.min(batch, count - issued);
      game.addExecution(
        new ConstructionExecution(
          attacker,
          UnitType.AtomBomb,
          target,
          direction,
          amount,
        ),
      );
      issued += amount;
      orders++;
      nextOrder += gap;
      if (gap > 0) break;
    }
    game.executeNextTick();
    for (const { u, row } of bombs.values()) {
      if (row.wait === undefined) {
        row.wait = u.nukeState().waitTicks;
        row.firstMotionTick = row.tick + row.wait + 1;
      }
    }
    if (
      t > nextOrder + 250 &&
      attacker.units(UnitType.AtomBomb).length === 0 &&
      game.units(UnitType.SAMMissile).length === 0
    )
      break;
  }
  const launches = events.filter((e) => e.kind === "launch");
  const shots = events.filter((e) => e.kind === "sam");
  const summary = {
    name: options.name,
    levels,
    sams,
    batch,
    gapTicks: gap,
    count,
    orders,
    launched: launches.length,
    intercepted,
    landed,
    samAlive: samUnits.map((u: any) => u.isActive()),
    launchSpanSeconds: launches.length
      ? (Math.max(...launches.map((e) => e.firstMotionTick)) -
          Math.min(...launches.map((e) => e.firstMotionTick))) /
        10
      : 0,
    samShots: shots.length,
    samPeaks: samUnits.map((u: any) => ({
      id: u.id(),
      level: u.level(),
      shots: shots.filter((e) => e.sam === u.id()).length,
      peakReloading: Math.max(
        0,
        ...shots.filter((e) => e.sam === u.id()).map((e) => e.reloading),
      ),
    })),
    silos: silos.map((u: any) => ({
      id: u.id(),
      level: u.level(),
      launches: launches.filter((e) => e.src === u.tile()).length,
      firstMotionTick: Math.min(
        ...launches
          .filter((e) => e.src === u.tile())
          .map((e) => e.firstMotionTick),
      ),
    })),
  };
  const predicted = simulate(
    snapshot,
    makeSalvo(snapshot, snapshot.silos, count, gap, direction),
    { trace: true },
  );
  assert.equal(
    predicted.firstImpact,
    events.find((e) => e.kind === "impact")?.tick ?? null,
    options.name + " first impact",
  );
  assert.deepEqual(
    predicted.launches,
    shots
      .filter(
        (s) =>
          predicted.firstImpact === null || s.tick <= predicted.firstImpact,
      )
      .map((s) => ({
        tick: s.tick,
        sam: s.sam,
        target: launches.findIndex((b) => b.id === s.target),
      })),
    options.name + " SAM launches",
  );
  assert.equal(predicted.breached, landed > 0, options.name);
  assert.equal(
    makeSalvo(snapshot, snapshot.silos, count, gap, direction).length,
    launches.length,
    options.name + " launch count",
  );
  return summary;
}

const cases = [
  { name: "one silo", levels: [101] },
  { name: "two silos" },
  { name: "all orders at once", gap: 0 },
  { name: "two 51", levels: [51, 51], count: 102, siloSpacing: 16 },
  { name: "two 52+51", levels: [52, 51], count: 103, siloSpacing: 16 },
  { name: "three silos", levels: [34, 34, 33], siloSpacing: 16 },
  { name: "three slower", levels: [34, 34, 33], siloSpacing: 16, gap: 2 },
  {
    name: "five slower",
    levels: [21, 20, 20, 20, 20],
    siloSpacing: 16,
    gap: 4,
  },
  { name: "near target", distance: 200 },
  { name: "downward arc", direction: false },
  {
    name: "overlap 100+1",
    gap: 0,
    sams: [
      { x: 800, y: 400, level: 100 },
      { x: 820, y: 400, level: 1 },
    ],
  },
  {
    name: "overlap 50+50",
    sams: [
      { x: 800, y: 400, level: 50 },
      { x: 820, y: 400, level: 50 },
    ],
  },
  {
    name: "out of range",
    sams: [
      { x: 800, y: 400, level: 100 },
      { x: 1000, y: 400, level: 1 },
    ],
  },
];
for (const scenario of cases) {
  const result = runScenario(scenario);
  console.log(`${scenario.name}: ${result.landed > 0 ? "breach" : "blocked"}`);
}
console.log(`breachEngine: ${cases.length} scenarios match OpenFront`);
