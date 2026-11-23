import {
  ParabolaUniversalPathFinder,
  SAMLauncherExecution,
  UnitGrid,
} from "./vendor/openfront.js";

const ATOM = "Atom Bomb";
const INTERCEPTOR = "SAM Missile";
export const available = () => true;

const geometry = (rules) => ({
  width: () => rules.width,
  height: () => rules.height,
  ref: (x, y) => y * rules.width + x,
  x: (tile) => tile % rules.width,
  y: (tile) => Math.floor(tile / rules.width),
});

export function trajectory(from, to, rules, directionUp = true) {
  const map = geometry(rules);
  const path = new ParabolaUniversalPathFinder(map, {
    increment: rules.nukeSpeed,
    directionUp,
  }).findPath(map.ref(from.x, from.y), map.ref(to.x, to.y));
  return path.map((tile) => {
    const x = map.x(tile),
      y = map.y(tile);
    return {
      x,
      y,
      targetable:
        (x - from.x) ** 2 + (y - from.y) ** 2 < rules.targetableRange ** 2 ||
        (x - to.x) ** 2 + (y - to.y) ** 2 < rules.targetableRange ** 2,
    };
  });
}

export function simulate(snapshot, bombs, { trace = false } = {}) {
  const { rules } = snapshot;
  const map = geometry(rules);
  const originTick = snapshot.tick ?? 0;
  let tick = 0,
    breached = false,
    firstImpact = null,
    nextId = 1;
  const units = [],
    pending = [],
    executions = [],
    samUnits = [],
    launches = [];
  const grid = new UnitGrid(map);
  const attacker = { isFriendly: () => false };
  const defender = {
    id: () => "defender",
    isFriendly: () => false,
    buildUnit: (type, tile, params) => unit(type, tile, defender, params),
  };
  const config = {
    defaultSamMissileSpeed: () => rules.samSpeed,
    maxSamRange: () => rules.maxSamRange,
    defaultNukeTargetableRange: () => rules.targetableRange,
    SAMCooldown: () => rules.samCooldown,
    gameConfig: () => ({ gameType: "Singleplayer" }),
    dynamicSamRange: (sam, at) => {
      const s = sam.model;
      if (!s.upgrade || at - originTick >= s.upgrade.end) return s.range;
      return (
        s.upgrade.from +
        ((s.range - s.upgrade.from) *
          Math.max(0, at - originTick - s.upgrade.start)) /
          (s.upgrade.end - s.upgrade.start)
      );
    },
  };
  const game = {
    ...map,
    config: () => config,
    ticks: () => originTick + tick,
    getWinner: () => null,
    manhattanDist: (a, b) =>
      Math.abs(map.x(a) - map.x(b)) + Math.abs(map.y(a) - map.y(b)),
    euclideanDistSquared: (a, b) =>
      (map.x(a) - map.x(b)) ** 2 + (map.y(a) - map.y(b)) ** 2,
    nearbyUnits: (...args) => grid.nearbyUnits(...args),
    unitCount: (type) =>
      units.reduce((n, u) => n + Number(u.isActive() && u.type() === type), 0),
    displayMessage() {},
    stats: () => ({ bombIntercept() {} }),
    addExecution(exec) {
      pending.push(exec);
      if (trace)
        launches.push({
          tick,
          sam: exec.ownerUnit.model.id,
          target: exec.target.bomb.id,
        });
    },
  };
  function unit(type, initial, owner, params = {}) {
    let tile = initial,
      previous = initial,
      active = true,
      targeted = false;
    const id = nextId++;
    const u = {
      isUnit: () => true,
      id: () => id,
      type: () => type,
      tile: () => tile,
      lastTile: () => previous,
      owner: () => owner,
      isActive: () => active,
      isUnderConstruction: () => false,
      move(next) {
        previous = tile;
        tile = next;
        grid.updateUnitCell(u);
      },
      delete() {
        if (active) grid.removeUnit(u);
        active = false;
      },
      targetedBySAM: () => targeted,
      setTargetedBySAM: (value) => {
        targeted = value;
      },
      targetUnit: () => params.targetUnit,
    };
    units.push(u);
    grid.addUnit(u);
    return u;
  }
  for (const s of snapshot.sams) {
    const paths = new Set(bombs.map((b) => b.path));
    if (
      ![...paths].some((path) =>
        path.some(
          (p) =>
            p.targetable && (p.x - s.x) ** 2 + (p.y - s.y) ** 2 <= s.range ** 2,
        ),
      )
    )
      continue;
    const sam = unit("SAM Launcher", map.ref(s.x, s.y), defender);
    let queue = s.queue.map((t) => originTick + t);
    Object.assign(sam, {
      model: s,
      shots: 0,
      level: () => s.level,
      missileTimerQueue: () => queue,
      reloadMissile: () => queue.shift(),
      isInCooldown: () => queue.length >= s.level,
      launch() {
        queue.push(game.ticks());
        sam.shots++;
      },
    });
    const exec = new SAMLauncherExecution(defender, null, sam);
    exec.init(game, game.ticks());
    executions.push(exec);
    samUnits.push(sam);
  }
  const scheduled = new Map();
  for (const bomb of bombs) {
    if (!scheduled.has(bomb.created)) scheduled.set(bomb.created, []);
    scheduled.get(bomb.created).push(bomb);
  }
  const lastTick = Math.max(0, ...bombs.map((b) => b.impact));
  for (tick = 0; tick <= lastTick; tick++) {
    for (const bomb of scheduled.get(tick) ?? []) {
      let nuke = null,
        index = 0,
        wait = bomb.firstMotion - bomb.created - 1;
      const path = bomb.path.map((p) => map.ref(p.x, p.y));
      executions.push({
        isActive: () => nuke === null || nuke.isActive(),
        tick() {
          if (nuke === null) {
            nuke = unit(ATOM, path[0], attacker);
            Object.assign(nuke, {
              bomb,
              trajectory: () => path,
              trajectoryIndex: () => index,
              nukeState: () => ({ waitTicks: wait }),
              targetTile: () => path.at(-1),
            });
            return;
          }
          if (wait > 0) {
            wait--;
            return;
          }
          if (tick >= bomb.impact) {
            nuke.move(path.at(-1));
            const defended =
              game.nearbyUnits(
                nuke.tile(),
                rules.samSpeed,
                INTERCEPTOR,
                ({ unit: u }) => u.targetUnit() === nuke,
              ).length > 0;
            if (!defended) {
              breached = true;
              firstImpact = tick;
              nuke.delete();
            }
            return;
          }
          index = tick - bomb.firstMotion + 1;
          nuke.move(path[index]);
        },
      });
    }
    for (const exec of executions) {
      if (exec.isActive()) exec.tick(game.ticks());
      if (breached) break;
    }
    if (breached) break;
    for (const exec of pending.splice(0)) {
      exec.init(game, game.ticks());
      executions.push(exec);
    }
  }
  return {
    breached,
    firstImpact,
    shots: samUnits.map((s) => ({ id: s.model.id, shots: s.shots })),
    ...(trace ? { launches } : {}),
  };
}
