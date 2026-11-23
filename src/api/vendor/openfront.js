// Generated from OpenFront (AGPL-3.0); see openfront-LICENSE and openfront-sources.json.
// packages/engine-lib/src/PseudoRandom.ts
var PseudoRandom = class _PseudoRandom {
  static {
    this.POW36_8 = 2821109907456;
  }
  // 36 ** 8
  constructor(seed) {
    let h = seed | 0;
    const split = () => {
      h = h + 2654435769 | 0;
      let t = h ^ h >>> 16;
      t = Math.imul(t, 569420461);
      t = t ^ t >>> 15;
      t = Math.imul(t, 1935289751);
      return t ^ t >>> 15 | 0;
    };
    this.s0 = split();
    this.s1 = split();
    this.s2 = split();
    this.s3 = split();
    for (let i = 0; i < 12; i++) {
      this.next();
    }
  }
  /** The four sfc32 state words, for snapshots. */
  getState() {
    return [this.s0, this.s1, this.s2, this.s3];
  }
  /** Rebuilds a generator from getState() output without re-seeding. */
  static fromState(state) {
    const r = Object.create(_PseudoRandom.prototype);
    r.s0 = state[0] | 0;
    r.s1 = state[1] | 0;
    r.s2 = state[2] | 0;
    r.s3 = state[3] | 0;
    return r;
  }
  // Generates the next pseudorandom number between 0 and 1.
  next() {
    const t = (this.s0 + this.s1 | 0) + this.s3 | 0;
    this.s3 = this.s3 + 1 | 0;
    this.s0 = this.s1 ^ this.s1 >>> 9;
    this.s1 = this.s2 + (this.s2 << 3) | 0;
    this.s2 = this.s2 << 21 | this.s2 >>> 11;
    this.s2 = this.s2 + t | 0;
    return (t >>> 0) / 4294967296;
  }
  // Generates a random integer between min (inclusive) and max (exclusive).
  nextInt(min, max) {
    const lo = Math.floor(min);
    const hi = Math.floor(max);
    return Math.floor(this.next() * (hi - lo)) + lo;
  }
  // Generates a random float between min (inclusive) and max (exclusive).
  nextFloat(min, max) {
    return this.next() * (max - min) + min;
  }
  // Generates a random ID (8 characters, alphanumeric).
  nextID() {
    return Math.floor(this.next() * _PseudoRandom.POW36_8).toString(36).padStart(8, "0");
  }
  // Selects a random element from an array.
  randElement(arr) {
    if (arr.length === 0) {
      throw new Error("array must not be empty");
    }
    return arr[this.nextInt(0, arr.length)];
  }
  // Selects a random element from a set.
  randFromSet(set) {
    const size = set.size;
    if (size === 0) {
      throw new Error("set must not be empty");
    }
    const index = this.nextInt(0, size);
    let i = 0;
    for (const item of set) {
      if (i === index) {
        return item;
      }
      i++;
    }
    throw new Error("Unexpected error selecting element from set");
  }
  // Returns true with probability 1/odds.
  chance(odds) {
    return this.nextInt(0, odds) === 0;
  }
  // Returns a shuffled copy of the array using Fisher-Yates algorithm.
  shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
};

// packages/engine-lib/src/snapshot/SnapshotType.ts
var stub = new Proxy(function() {
}, {
  get: (_, key) => key === "then" || typeof key === "symbol" ? void 0 : stub,
  apply: () => stub,
  construct: () => stub
});
var zInt = stub;
var zNum = stub;
var zTile = stub;
var zRandom = stub;
var zRef = stub;
var zPlayerRef = stub;

// stub:zod
var stub2 = new Proxy(function() {
}, {
  get: (_, key) => key === "then" || typeof key === "symbol" ? void 0 : stub2,
  apply: () => stub2,
  construct: () => stub2
});
var z = stub2;

// packages/engine/src/game/Game.ts
function isUnit(unit) {
  return unit && typeof unit === "object" && "isUnit" in unit && typeof unit.isUnit === "function" && unit.isUnit();
}

// packages/engine/src/snapshot/ExecutionSnapshot.ts
var stub3 = new Proxy(function() {
}, {
  get: (_, key) => key === "then" || typeof key === "symbol" ? void 0 : stub3,
  apply: () => stub3,
  construct: () => stub3
});
var execSnapshotType = stub3;

// packages/engine/src/pathfinding/PathFinder.Air.ts
var AirPathFinder = class {
  constructor(game) {
    this.game = game;
    this.seed = game.ticks();
  }
  /** Paths are drawn from a generator re-seeded with this on every query. */
  getSeed() {
    return this.seed;
  }
  setSeed(seed) {
    this.seed = seed;
  }
  findPath(from, to) {
    if (Array.isArray(from)) {
      throw new Error("AirPathFinder does not support multiple start points");
    }
    const random = new PseudoRandom(this.seed);
    const path = [from];
    let current = from;
    while (current !== to) {
      const next = this.computeNext(current, to, random);
      if (next === current) break;
      current = next;
      path.push(current);
    }
    return path;
  }
  computeNext(from, to, random) {
    const x = this.game.x(from);
    const y = this.game.y(from);
    const dstX = this.game.x(to);
    const dstY = this.game.y(to);
    if (x === dstX && y === dstY) {
      return to;
    }
    let nextX = x;
    let nextY = y;
    const ratio = Math.floor(1 + Math.abs(dstY - y) / (Math.abs(dstX - x) + 1));
    if (x === dstX) {
      nextY += y < dstY ? 1 : -1;
    } else if (y === dstY) {
      nextX += x < dstX ? 1 : -1;
    } else {
      if (random.chance(ratio)) {
        nextX += x < dstX ? 1 : -1;
      } else {
        nextY += y < dstY ? 1 : -1;
      }
    }
    return this.game.ref(nextX, nextY);
  }
};

// packages/engine/src/utilities/DebugSpan.ts
var stack = [];
function isEnabled() {
  return globalThis.__DEBUG_SPAN_ENABLED__ === true;
}
var DebugSpan = {
  isEnabled,
  enable() {
    globalThis.__DEBUG_SPAN_ENABLED__ = true;
  },
  disable() {
    globalThis.__DEBUG_SPAN_ENABLED__ = false;
  },
  start(name) {
    if (!isEnabled()) return;
    const span = {
      name,
      timeStart: performance.now(),
      data: {},
      children: []
    };
    const parent = stack[stack.length - 1];
    parent?.children.push(span);
    stack.push(span);
  },
  end(name) {
    if (!isEnabled()) return;
    if (stack.length === 0) {
      const payload = name ? `"${name}"` : "";
      throw new Error(`DebugSpan.end(${payload}): no open span`);
    }
    if (name) {
      while (stack.length > 0) {
        const span2 = stack.pop();
        span2.timeEnd = performance.now();
        span2.duration = span2.timeEnd - span2.timeStart;
        if (stack.length === 0) {
          DebugSpan.storeSpan(span2);
        }
        if (span2.name === name) break;
      }
      return;
    }
    const span = stack.pop();
    span.timeEnd = performance.now();
    span.duration = span.timeEnd - span.timeStart;
    if (stack.length === 0) {
      DebugSpan.storeSpan(span);
    }
  },
  storeSpan(span) {
    if (!isEnabled()) return;
    globalThis.__DEBUG_SPANS__ = globalThis.__DEBUG_SPANS__ ?? [];
    globalThis.__DEBUG_SPANS__.push(span);
    const extractData = (span2) => {
      return Object.fromEntries(
        Object.entries(span2.data).filter(
          ([key]) => typeof key === "string" && key.startsWith("$")
        )
      );
    };
    const properties = {
      timings: { total: span.duration },
      data: extractData(span)
    };
    if (span.children.length > 0) {
      const getChildren = (span2) => span2.children.flatMap((child) => [child, ...getChildren(child)]);
      const children = getChildren(span);
      for (const childSpan of children) {
        properties.timings[childSpan.name] = childSpan.duration;
        const childData = extractData(childSpan);
        for (const key of Object.keys(childData)) {
          properties.data[key] = childData[key];
        }
      }
    }
    try {
      performance.measure(span.name, {
        start: span.timeStart,
        end: span.timeEnd,
        detail: properties
      });
    } catch (err) {
      console.error("DebugSpan.storeSpan: performance.measure failed", err);
      console.error("Span:", span);
    }
    while (globalThis.__DEBUG_SPANS__.length > 100) {
      globalThis.__DEBUG_SPANS__.shift();
    }
  },
  wrap(name, fn) {
    this.start(name);
    try {
      return fn();
    } finally {
      this.end(name);
    }
  },
  set(key, valueFn, root = true) {
    if (!isEnabled()) return;
    if (stack.length === 0) {
      throw new Error(`DebugSpan.set("${key}"): no open span`);
    }
    const span = root ? stack[0] : stack[stack.length - 1];
    span.data[key] = valueFn(span.data[key]);
  },
  getLastSpan(name) {
    if (!isEnabled()) return;
    globalThis.__DEBUG_SPANS__ = globalThis.__DEBUG_SPANS__ ?? [];
    if (name) {
      for (let i = globalThis.__DEBUG_SPANS__.length - 1 || 0; i >= 0; i--) {
        const span = globalThis.__DEBUG_SPANS__[i];
        if (span.name === name) {
          return span;
        }
      }
      return void 0;
    }
    return globalThis.__DEBUG_SPANS__[globalThis.__DEBUG_SPANS__.length - 1];
  }
};

// packages/engine/src/pathfinding/PathFinderStepper.ts
var PathFinderStepper = class {
  constructor(finder, config = { equals: (a, b) => a === b }) {
    this.finder = finder;
    this.config = config;
    // Numeric paths (TileRefs) are stored as a Uint32Array: steppers hold their
    // whole path for the unit's entire journey, and paths across large maps run
    // to thousands of nodes, so halving the per-node size matters in aggregate.
    this.path = null;
    this.pathIndex = 0;
    this.lastTo = null;
  }
  /**
   * Get the next step on the path from `from` to `to`.
   * Returns PathResult with status and optional next node.
   */
  next(from, to, dist) {
    if (this.config.preCheck) {
      const result = this.config.preCheck(from, to);
      if (result) return result;
    }
    if (this.config.equals(from, to)) {
      return { status: 2 /* COMPLETE */, node: to };
    }
    if (dist !== void 0 && dist > 0 && this.config.distance) {
      if (this.config.distance(from, to) <= dist) {
        return { status: 2 /* COMPLETE */, node: from };
      }
    }
    if (this.lastTo === null || !this.config.equals(this.lastTo, to)) {
      this.path = null;
      this.pathIndex = 0;
      this.lastTo = to;
    }
    if (this.path === null) {
      let path;
      try {
        path = this.finder.findPath(from, to);
      } catch (err) {
        console.error("PathFinder threw an error during findPath", err);
        return { status: 3 /* NOT_FOUND */ };
      }
      if (path === null) {
        return { status: 3 /* NOT_FOUND */ };
      }
      this.path = path.length > 0 && typeof path[0] === "number" ? new Uint32Array(path) : path;
      this.pathIndex = 0;
      if (path.length > 0 && this.config.equals(path[0], from)) {
        this.pathIndex = 1;
      }
    }
    const expectedPos = this.path[this.pathIndex - 1];
    if (this.pathIndex > 0 && !this.config.equals(from, expectedPos)) {
      this.invalidate();
      this.lastTo = to;
      return this.next(from, to, dist);
    }
    if (this.pathIndex >= this.path.length) {
      return { status: 2 /* COMPLETE */, node: to };
    }
    const nextNode = this.path[this.pathIndex];
    this.pathIndex++;
    return { status: 0 /* NEXT */, node: nextNode };
  }
  invalidate() {
    this.path = null;
    this.pathIndex = 0;
    this.lastTo = null;
  }
  /** Traversal progress, for game snapshots (see PathfinderSnapshots). */
  getState() {
    return { path: this.path, pathIndex: this.pathIndex, lastTo: this.lastTo };
  }
  setState(s) {
    this.path = s.path;
    this.pathIndex = s.pathIndex;
    this.lastTo = s.lastTo;
  }
  /** The wrapped finder, for snapshots of finders that carry state. */
  innerFinder() {
    return this.finder;
  }
  /**
   * Returns a copy of the active path beginning at the node most recently
   * returned by next(). Returns null when there is no active traversal.
   */
  pathAfterNext() {
    if (this.path === null || this.pathIndex === 0) return null;
    return this.path.slice(this.pathIndex - 1);
  }
  /** Computes a one-shot route without changing the cached route. */
  findPath(from, to) {
    if (this.config.preCheck) {
      const fromArray = Array.isArray(from) ? from : [from];
      const allFailed = fromArray.every((f) => {
        const result = this.config.preCheck(f, to);
        return result?.status === 3 /* NOT_FOUND */;
      });
      if (allFailed) {
        return null;
      }
    }
    return this.finder.findPath(from, to);
  }
};

// packages/engine/src/pathfinding/PathFinderBuilder.ts
var PathFinderBuilder = class _PathFinderBuilder {
  constructor(core) {
    this.core = core;
    this.wrappers = [];
  }
  static create(core) {
    return new _PathFinderBuilder(core);
  }
  wrap(factory) {
    this.wrappers.push(factory);
    return this;
  }
  build() {
    const pathFinder = this.wrappers.reduce(
      (pf, wrapper) => wrapper(pf),
      this.core
    );
    const _findPath = pathFinder.findPath;
    pathFinder.findPath = function(from, to) {
      return DebugSpan.wrap("findPath", () => _findPath.call(this, from, to));
    };
    return pathFinder;
  }
  /**
   * Build and wrap with PathFinderStepper for step-by-step traversal.
   */
  buildWithStepper(config) {
    return new PathFinderStepper(this.build(), config);
  }
};

// packages/engine/src/pathfinding/PathFinder.ts
var PathFinding = class {
  static Air(game) {
    const pf = new AirPathFinder(game);
    return PathFinderBuilder.create(pf).buildWithStepper({
      equals: (a, b) => a === b
    });
  }
};

// packages/engine/src/snapshot/PathfinderSnapshots.ts
var stub4 = new Proxy(function() {
}, {
  get: (_, key) => key === "then" || typeof key === "symbol" ? void 0 : stub4,
  apply: () => stub4,
  construct: () => stub4
});
var AirPathFinderSchema = stub4;
var airPathFinderState = stub4;
var restoreAirPathFinder = stub4;

// packages/engine/src/execution/SAMMissileExecution.ts
var INTERCEPTED_UNIT_TRANSLATION_KEYS = {
  ["Atom Bomb" /* AtomBomb */]: "unit_type.atom_bomb",
  ["Hydrogen Bomb" /* HydrogenBomb */]: "unit_type.hydrogen_bomb",
  ["MIRV Warhead" /* MIRVWarhead */]: "unit_type.mirv"
};
var SAMMissileExecution = class {
  constructor(spawn, _owner, ownerUnit, target, targetTile) {
    this.spawn = spawn;
    this._owner = _owner;
    this.ownerUnit = ownerUnit;
    this.target = target;
    this.targetTile = targetTile;
    this.active = true;
    this.speed = 0;
  }
  init(mg, ticks) {
    this.pathFinder = PathFinding.Air(mg);
    this.mg = mg;
    this.speed = this.mg.config().defaultSamMissileSpeed();
    this.tick(ticks);
  }
  tick(ticks) {
    this.SAMMissile ??= this._owner.buildUnit("SAMMissile" /* SAMMissile */, this.spawn, {
      targetUnit: this.target
    });
    if (!this.SAMMissile.isActive()) {
      this.active = false;
      return;
    }
    const nukesWhitelist = [
      "Atom Bomb" /* AtomBomb */,
      "Hydrogen Bomb" /* HydrogenBomb */,
      "MIRV Warhead" /* MIRVWarhead */
    ];
    if (!this.target.isActive() || !this.ownerUnit.isActive() || this.target.owner() === this.SAMMissile.owner() || !nukesWhitelist.includes(this.target.type())) {
      if (this.target.isActive()) {
        this.target.setTargetedBySAM(false);
      }
      this.SAMMissile.delete(false);
      this.active = false;
      return;
    }
    for (let i = 0; i < this.speed; i++) {
      const result = this.pathFinder.next(
        this.SAMMissile.tile(),
        this.targetTile
      );
      if (result.status === 2 /* COMPLETE */) {
        this.mg.displayMessage(
          "events_display.missile_intercepted",
          10 /* SAM_HIT */,
          this._owner.id(),
          void 0,
          {
            unit: INTERCEPTED_UNIT_TRANSLATION_KEYS[this.target.type()] ?? this.target.type()
          }
        );
        this.active = false;
        this.target.delete(true, this._owner);
        this.SAMMissile.delete(false);
        this.mg.stats().bombIntercept(this._owner, this.target.type(), 1);
        return;
      } else if (result.status === 0 /* NEXT */) {
        this.SAMMissile.move(result.node);
      }
    }
  }
  isActive() {
    return this.active;
  }
  activeDuringSpawnPhase() {
    return false;
  }
  snapshot(w) {
    return SAMMissileExecutionSnapshot.write({
      active: this.active,
      // mg and the pathfinder are both set by init.
      pathFinder: this.mg === void 0 ? null : airPathFinderState(this.pathFinder),
      missile: this.SAMMissile === void 0 ? null : w.unit(this.SAMMissile),
      speed: this.speed,
      spawn: this.spawn,
      owner: w.player(this._owner),
      ownerUnit: w.unit(this.ownerUnit),
      target: w.unit(this.target),
      targetTile: this.targetTile
    });
  }
  restoreSnapshot(s, r) {
    this.active = s.active;
    if (s.pathFinder !== null) {
      this.mg = r.game;
      this.pathFinder = restoreAirPathFinder(r.game, s.pathFinder);
    }
    if (s.missile !== null) this.SAMMissile = r.unit(s.missile);
    this.speed = s.speed;
    this.spawn = s.spawn;
    this._owner = r.player(s.owner);
    this.ownerUnit = r.unit(s.ownerUnit);
    this.target = r.unit(s.target);
    this.targetTile = s.targetTile;
  }
};
var SAMMissileStateSchema = z.object({
  active: z.boolean(),
  pathFinder: AirPathFinderSchema.nullable(),
  missile: zRef().nullable(),
  speed: zNum(),
  spawn: zTile(),
  owner: zPlayerRef(),
  ownerUnit: zRef(),
  target: zRef(),
  targetTile: zTile()
});
var SAMMissileExecutionSnapshot = execSnapshotType({
  name: "SAMMissile",
  version: 1,
  schema: SAMMissileStateSchema,
  cls: () => SAMMissileExecution
});

// packages/engine/src/execution/SAMLauncherExecution.ts
var SAMTargetingSystem = class {
  constructor(mg, sam) {
    this.mg = mg;
    this.sam = sam;
    // Cached interception states indexed by nuke ID to avoid per-tick recomputation.
    this.precomputedNukes = /* @__PURE__ */ new Map();
    this.isTargetableNearbyUnit = ({
      unit
    }) => {
      return this.isValidNukeTarget(unit);
    };
    this.missileSpeed = this.mg.config().defaultSamMissileSpeed();
    this.isTargetableNearbyUnit = this.isTargetableNearbyUnit.bind(this);
  }
  /** Cached interceptions in insertion order, for game snapshots. */
  getState() {
    return [...this.precomputedNukes].map(([id, c]) => ({
      id,
      tick: c.tick,
      tile: c.tile,
      minDistSq: c.minDistSq,
      lastSeenTick: c.lastSeenTick
    }));
  }
  setState(s) {
    for (const { id, tick, tile, minDistSq, lastSeenTick } of s) {
      this.precomputedNukes.set(id, { tick, tile, minDistSq, lastSeenTick });
    }
  }
  onLevelUp() {
    for (const [id, cached] of this.precomputedNukes) {
      if (cached.tick === -1) {
        this.precomputedNukes.delete(id);
      }
    }
  }
  updateUnreachableNukes(currentTick) {
    for (const [id, cached] of this.precomputedNukes) {
      if (cached.lastSeenTick !== currentTick) {
        this.precomputedNukes.delete(id);
      }
    }
  }
  tickToReach(currentTile, tile) {
    return Math.ceil(
      this.mg.manhattanDist(currentTile, tile) / this.missileSpeed
    );
  }
  checkDetonationInterception(unit, samTile, ticks) {
    const trajectory = unit.trajectory();
    const maxIdx = trajectory.length - 2;
    const finalTile = trajectory[trajectory.length - 1];
    if (finalTile === void 0) return void 0;
    const curIdx = unit.trajectoryIndex();
    const waitTicks = unit.nukeState().waitTicks ?? 0;
    const expTicks = trajectory.length - 1 - curIdx + waitTicks;
    const range = this.mg.config().dynamicSamRange(this.sam, ticks + expTicks);
    if (this.mg.euclideanDistSquared(samTile, finalTile) > range * range) {
      return void 0;
    }
    const flightTile = trajectory[maxIdx];
    if (flightTile === void 0) return void 0;
    const nukeTicks = maxIdx - curIdx + waitTicks;
    const samTicks = this.tickToReach(samTile, flightTile);
    const tickBeforeShooting = nukeTicks - samTicks;
    return tickBeforeShooting >= 0 ? { tick: tickBeforeShooting, tile: flightTile } : void 0;
  }
  isTargetableAt(tile, src, dst) {
    const targetRangeSquared = this.mg.config().defaultNukeTargetableRange() ** 2;
    return this.mg.euclideanDistSquared(tile, dst) < targetRangeSquared || this.mg.euclideanDistSquared(tile, src) < targetRangeSquared;
  }
  computeInterceptionTile(unit, samTile, ticks) {
    const trajectory = unit.trajectory();
    const curIdx = unit.trajectoryIndex();
    const waitTicks = unit.nukeState().waitTicks ?? 0;
    const maxIdx = trajectory.length - 2;
    const maxSamRangeSq = this.mg.config().maxSamRange() ** 2;
    let minDistSq = Infinity;
    let closestTile = samTile;
    let incSteps = 0;
    let lastDistSq = -1;
    const src = trajectory[0];
    const dst = trajectory[trajectory.length - 1];
    for (let i = curIdx; i <= maxIdx; i++) {
      const tile = trajectory[i];
      if (tile === void 0) continue;
      const distSq = this.mg.euclideanDistSquared(samTile, tile);
      if (distSq < minDistSq) {
        minDistSq = distSq;
        closestTile = tile;
      }
      incSteps = lastDistSq !== -1 && distSq > lastDistSq ? incSteps + 1 : 0;
      lastDistSq = distSq;
      const nukeTicks = i - curIdx + waitTicks;
      const samTicks = this.tickToReach(samTile, tile);
      const allowed = this.mg.config().dynamicSamRange(this.sam, ticks + nukeTicks);
      if (distSq <= allowed * allowed && nukeTicks >= samTicks && src !== void 0 && dst !== void 0 && this.isTargetableAt(tile, src, dst)) {
        return {
          tick: nukeTicks - samTicks,
          tile,
          minDistSq,
          lastSeenTick: ticks
        };
      }
      if (incSteps > 3 && distSq > maxSamRangeSq) break;
    }
    const det = this.checkDetonationInterception(unit, samTile, ticks);
    if (det) {
      return { tick: det.tick, tile: det.tile, minDistSq, lastSeenTick: ticks };
    }
    return {
      tick: minDistSq > maxSamRangeSq ? -2 : -1,
      tile: closestTile,
      minDistSq,
      lastSeenTick: ticks
    };
  }
  isValidNukeTarget(unit) {
    if (!isUnit(unit) || unit.targetedBySAM() || unit.owner() === this.sam.owner()) {
      return false;
    }
    const samOwner = this.sam.owner();
    const nukeOwner = unit.owner();
    if (samOwner.isFriendly(nukeOwner)) {
      const gameOver = this.mg.getWinner() !== null && this.mg.config().gameConfig().gameType !== "Singleplayer" /* Singleplayer */;
      return gameOver && samOwner.isOnSameTeam(nukeOwner);
    }
    return true;
  }
  computeTargetScore(target) {
    const samTile = this.sam.tile();
    const unit = target.unit;
    const trajectory = unit.trajectory();
    const currentIndex = unit.trajectoryIndex();
    const timeToExplode = Math.max(1, trajectory.length - currentIndex);
    const targetTile = unit.targetTile() ?? (trajectory.length > 0 ? trajectory[trajectory.length - 1] : samTile);
    const distToSilo = this.mg.manhattanDist(samTile, targetTile);
    const typeBonus = unit.type() === "Hydrogen Bomb" /* HydrogenBomb */ ? 70001 : 0;
    const distanceBonus = Math.max(0, 2e5 - distToSilo * 1e3);
    const urgencyBonus = Math.max(0, 1e4 - timeToExplode * 100);
    return typeBonus + distanceBonus + urgencyBonus;
  }
  sortTargets(targets) {
    if (targets.length <= 1) return targets;
    for (const target of targets) {
      target.score = this.computeTargetScore(target);
    }
    return targets.sort((a, b) => b.score - a.score);
  }
  getValidTargets(ticks) {
    const samTile = this.sam.tile();
    const detectionRange = this.mg.config().maxSamRange() * 4;
    const nukes = this.mg.nearbyUnits(
      samTile,
      detectionRange,
      ["Atom Bomb" /* AtomBomb */, "Hydrogen Bomb" /* HydrogenBomb */, "MIRV Warhead" /* MIRVWarhead */],
      this.isTargetableNearbyUnit
    );
    const targets = [];
    for (const nuke of nukes) {
      const id = nuke.unit.id();
      const cached = this.precomputedNukes.get(id);
      if (cached !== void 0) {
        cached.lastSeenTick = ticks;
        if (cached.tick === -2 || cached.tick === -1) continue;
        if (cached.tick === ticks || cached.tick === ticks + 1) {
          targets.push({ tile: cached.tile, unit: nuke.unit });
          this.precomputedNukes.delete(id);
          continue;
        }
        if (cached.tick > ticks) continue;
        this.precomputedNukes.delete(id);
      }
      const res = this.computeInterceptionTile(nuke.unit, samTile, ticks);
      if (res.tick >= 0 && res.tick <= 1) {
        targets.push({ unit: nuke.unit, tile: res.tile });
      } else {
        this.precomputedNukes.set(id, {
          tick: res.tick >= 0 ? res.tick + ticks : res.tick,
          tile: res.tile,
          minDistSq: res.minDistSq,
          lastSeenTick: ticks
        });
      }
    }
    this.updateUnreachableNukes(ticks);
    return this.sortTargets(targets);
  }
};
var SAMLauncherExecution = class {
  constructor(player, tile, sam = null) {
    this.player = player;
    this.tile = tile;
    this.sam = sam;
    this.active = true;
    this.lastLevel = 1;
    if (sam !== null) {
      this.tile = sam.tile();
    }
  }
  init(mg, ticks) {
    this.mg = mg;
  }
  tick(ticks) {
    if (this.mg === null || this.player === null) {
      throw new Error("Not initialized");
    }
    if (this.sam === null) {
      if (this.tile === null) {
        throw new Error("tile is null");
      }
      const spawnTile = this.player.canBuild("SAM Launcher" /* SAMLauncher */, this.tile);
      if (spawnTile === false) {
        console.warn("cannot build SAM Launcher");
        this.active = false;
        return;
      }
      this.sam = this.player.buildUnit("SAM Launcher" /* SAMLauncher */, spawnTile, {});
    }
    this.targetingSystem ??= new SAMTargetingSystem(this.mg, this.sam);
    if (this.lastLevel !== this.sam.level()) {
      this.lastLevel = this.sam.level();
      this.targetingSystem.onLevelUp();
    }
    if (this.sam.isUnderConstruction()) {
      return;
    }
    if (!this.sam.isActive()) {
      this.active = false;
      return;
    }
    if (this.player !== this.sam.owner()) {
      this.player = this.sam.owner();
    }
    while (this.sam.missileTimerQueue().length > 0) {
      const frontTime = this.sam.missileTimerQueue()[0];
      const cooldown = this.mg.config().SAMCooldown() - (this.mg.ticks() - frontTime);
      if (cooldown > 0) {
        break;
      }
      this.sam.reloadMissile();
    }
    if (this.sam.isInCooldown()) {
      return;
    }
    this.pseudoRandom ??= new PseudoRandom(this.sam.id());
    if (this.mg.unitCount("Atom Bomb" /* AtomBomb */) === 0 && this.mg.unitCount("Hydrogen Bomb" /* HydrogenBomb */) === 0 && this.mg.unitCount("MIRV Warhead" /* MIRVWarhead */) === 0) {
      return;
    }
    const targets = this.targetingSystem.getValidTargets(ticks);
    for (const target of targets) {
      if (this.sam.isInCooldown()) {
        break;
      }
      this.sam.launch();
      target.unit.setTargetedBySAM(true);
      this.mg.addExecution(
        new SAMMissileExecution(
          this.sam.tile(),
          this.sam.owner(),
          this.sam,
          target.unit,
          target.tile
        )
      );
    }
  }
  isActive() {
    return this.active;
  }
  activeDuringSpawnPhase() {
    return false;
  }
  snapshot(w) {
    return SAMLauncherExecutionSnapshot.write({
      active: this.active,
      initialized: this.mg !== void 0,
      player: w.player(this.player),
      tile: this.tile,
      sam: w.unitOrNull(this.sam),
      lastLevel: this.lastLevel,
      // Created on the first tick with a SAM (always this.sam).
      targeting: this.targetingSystem === void 0 ? null : this.targetingSystem.getState(),
      pseudoRandom: this.pseudoRandom === void 0 ? null : w.random(this.pseudoRandom)
    });
  }
  restoreSnapshot(s, r) {
    this.active = s.active;
    if (s.initialized) this.mg = r.game;
    this.player = r.player(s.player);
    this.tile = s.tile;
    this.sam = r.unitOrNull(s.sam);
    this.lastLevel = s.lastLevel;
    if (s.targeting !== null) {
      this.targetingSystem = new SAMTargetingSystem(r.game, this.sam);
      this.targetingSystem.setState(s.targeting);
    }
    this.pseudoRandom = s.pseudoRandom === null ? void 0 : r.random(s.pseudoRandom);
  }
};
var TargetingStateSchema = z.array(
  z.object({
    id: zInt(),
    tick: zInt(),
    tile: zTile(),
    // Infinity when the nuke had no trajectory tiles left to scan.
    minDistSq: zNum(),
    lastSeenTick: zInt()
  })
);
var SAMLauncherStateSchema = z.object({
  active: z.boolean(),
  initialized: z.boolean(),
  player: zPlayerRef(),
  tile: zInt().nullable(),
  sam: zRef().nullable(),
  lastLevel: zInt(),
  targeting: TargetingStateSchema.nullable(),
  pseudoRandom: zRandom().nullable()
});
var SAMLauncherExecutionSnapshot = execSnapshotType({
  name: "SAMLauncher",
  version: 1,
  schema: SAMLauncherStateSchema,
  cls: () => SAMLauncherExecution
});

// packages/engine-lib/src/Util.ts
function within(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// packages/engine/src/utilities/Line.ts
var DistanceBasedBezierCurve = class _DistanceBasedBezierCurve {
  constructor(p0, p1, p2, p3, distanceIncrement) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.cachedPoints = [];
    this.currentIndex = 0;
    this.pixelSpacingScaled = 1;
    this.accumulatedDistanceScaled = 0;
    this.computeAllPoints(distanceIncrement);
  }
  static {
    this.SUB_SCALE = 256;
  }
  /**
   * Statically compute the full length of a bezier curve without allocating any points.
   */
  static getLength(p0, p1, p2, p3) {
    const scale = 256;
    const p0x = Math.round(p0.x) * scale;
    const p0y = Math.round(p0.y) * scale;
    const p3x = Math.round(p3.x) * scale;
    const p3y = Math.round(p3.y) * scale;
    const st = { lastX: p0x, lastY: p0y, accumDist: 0 };
    _DistanceBasedBezierCurve.sharedSubdivide(
      p0x,
      p0y,
      Math.round(p1.x) * scale,
      Math.round(p1.y) * scale,
      Math.round(p2.x) * scale,
      Math.round(p2.y) * scale,
      p3x,
      p3y,
      0,
      st
    );
    const edx = p3x - st.lastX;
    const edy = p3y - st.lastY;
    st.accumDist += Math.floor(Math.sqrt(edx * edx + edy * edy));
    return st.accumDist / scale;
  }
  getAllPoints() {
    return this.cachedPoints;
  }
  /**
   * Move forward along the curve by the given distance/speed step.
   * Returns the next cached point, or null if at the end.
   */
  increment(distance = 1) {
    this.accumulatedDistanceScaled += Math.max(
      1,
      Math.round(distance * _DistanceBasedBezierCurve.SUB_SCALE)
    );
    while (this.currentIndex < this.cachedPoints.length - 1 && this.accumulatedDistanceScaled >= this.pixelSpacingScaled) {
      this.currentIndex++;
      this.accumulatedDistanceScaled -= this.pixelSpacingScaled;
    }
    if (this.currentIndex >= this.cachedPoints.length - 1) {
      return null;
    }
    return this.cachedPoints[this.currentIndex];
  }
  getCurrentIndex() {
    return this.currentIndex;
  }
  /** Control points and progress, for game snapshots. */
  getState() {
    return {
      points: [{ ...this.p0 }, { ...this.p1 }, { ...this.p2 }, { ...this.p3 }],
      currentIndex: this.currentIndex,
      accumulatedDistanceScaled: this.accumulatedDistanceScaled
    };
  }
  /** Restores progress onto a curve rebuilt from the same control points. */
  setProgress(currentIndex, accumulatedDistanceScaled) {
    this.currentIndex = currentIndex;
    this.accumulatedDistanceScaled = accumulatedDistanceScaled;
  }
  /**
   * Precompute curve points using Single-Pass In-Order Recursive De Casteljau Subdivision.
   * Uses IEEE 754 exact-rounded Math.floor(Math.sqrt(...)) for deterministic integer distance accumulation.
   */
  computeAllPoints(pixelSpacing) {
    this.cachedPoints = [];
    this.currentIndex = 0;
    this.accumulatedDistanceScaled = 0;
    this.pixelSpacingScaled = Math.max(
      _DistanceBasedBezierCurve.SUB_SCALE,
      Math.round(pixelSpacing * _DistanceBasedBezierCurve.SUB_SCALE)
    );
    const scale = _DistanceBasedBezierCurve.SUB_SCALE;
    const stepThreshold = this.pixelSpacingScaled;
    const p0x = Math.round(this.p0.x) * scale;
    const p0y = Math.round(this.p0.y) * scale;
    const p3x = Math.round(this.p3.x) * scale;
    const p3y = Math.round(this.p3.y) * scale;
    const st = {
      lastX: p0x,
      lastY: p0y,
      accumDist: 0,
      stepThreshold,
      cachedPoints: this.cachedPoints
    };
    this.cachedPoints.push({
      x: p0x + 128 >> 8,
      y: p0y + 128 >> 8
    });
    _DistanceBasedBezierCurve.sharedSubdivide(
      p0x,
      p0y,
      Math.round(this.p1.x) * scale,
      Math.round(this.p1.y) * scale,
      Math.round(this.p2.x) * scale,
      Math.round(this.p2.y) * scale,
      p3x,
      p3y,
      0,
      st
    );
    const lastPt = {
      x: p3x + 128 >> 8,
      y: p3y + 128 >> 8
    };
    const lastIndex = this.cachedPoints.length - 1;
    if (lastIndex >= 0) {
      const endCached = this.cachedPoints[lastIndex];
      if (endCached.x !== lastPt.x || endCached.y !== lastPt.y) {
        this.cachedPoints.push(lastPt);
      }
    } else {
      this.cachedPoints.push(lastPt);
    }
  }
  static sharedSubdivide(ax, ay, bx, by, cx, cy, dx, dy, depth, st) {
    const dist = Math.abs(bx - ax) + Math.abs(by - ay) + Math.abs(cx - bx) + Math.abs(cy - by) + Math.abs(dx - cx) + Math.abs(dy - cy);
    if (dist <= 256 || depth >= 10) {
      const edx = ax - st.lastX;
      const edy = ay - st.lastY;
      st.accumDist += Math.floor(Math.sqrt(edx * edx + edy * edy));
      st.lastX = ax;
      st.lastY = ay;
      if (st.stepThreshold !== void 0 && st.cachedPoints !== void 0) {
        while (st.accumDist >= st.stepThreshold) {
          st.cachedPoints.push({
            x: ax + 128 >> 8,
            y: ay + 128 >> 8
          });
          st.accumDist -= st.stepThreshold;
        }
      }
      return;
    }
    const m01_x = ax + bx >> 1;
    const m01_y = ay + by >> 1;
    const m12_x = bx + cx >> 1;
    const m12_y = by + cy >> 1;
    const m23_x = cx + dx >> 1;
    const m23_y = cy + dy >> 1;
    const m012_x = m01_x + m12_x >> 1;
    const m012_y = m01_y + m12_y >> 1;
    const m123_x = m12_x + m23_x >> 1;
    const m123_y = m12_y + m23_y >> 1;
    const mx = m012_x + m123_x >> 1;
    const my = m012_y + m123_y >> 1;
    _DistanceBasedBezierCurve.sharedSubdivide(
      ax,
      ay,
      m01_x,
      m01_y,
      m012_x,
      m012_y,
      mx,
      my,
      depth + 1,
      st
    );
    _DistanceBasedBezierCurve.sharedSubdivide(
      mx,
      my,
      m123_x,
      m123_y,
      m23_x,
      m23_y,
      dx,
      dy,
      depth + 1,
      st
    );
  }
};

// packages/engine/src/pathfinding/PathFinder.Parabola.ts
var PARABOLA_MIN_HEIGHT = 50;
function getParabolaControlPoints(gameMap, from, to, options) {
  const distanceBasedHeight = options?.distanceBasedHeight ?? true;
  const directionUp = options?.directionUp ?? true;
  const ignoreMapBounds = options?.ignoreMapBounds ?? false;
  const p0 = { x: gameMap.x(from), y: gameMap.y(from) };
  const p3 = { x: gameMap.x(to), y: gameMap.y(to) };
  const dx = p3.x - p0.x;
  const dy = p3.y - p0.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxHeight = distanceBasedHeight ? Math.max(distance / 3, PARABOLA_MIN_HEIGHT) : 0;
  const heightMult = directionUp ? -1 : 1;
  const mapHeight = gameMap.height();
  const p1y = p0.y + dy / 4 + heightMult * maxHeight;
  const p2y = p0.y + dy * 3 / 4 + heightMult * maxHeight;
  const p1 = {
    x: p0.x + dx / 4,
    y: ignoreMapBounds ? p1y : within(p1y, 0, mapHeight - 1)
  };
  const p2 = {
    x: p0.x + dx * 3 / 4,
    y: ignoreMapBounds ? p2y : within(p2y, 0, mapHeight - 1)
  };
  return [p0, p1, p2, p3];
}
var ParabolaUniversalPathFinder = class {
  constructor(gameMap, options) {
    this.gameMap = gameMap;
    this.options = options;
    this.curve = null;
    this.lastTo = null;
  }
  createCurve(from, to) {
    const increment = this.options?.increment ?? 3;
    const [p0, p1, p2, p3] = getParabolaControlPoints(
      this.gameMap,
      from,
      to,
      this.options
    );
    return new DistanceBasedBezierCurve(p0, p1, p2, p3, increment);
  }
  findPath(from, to) {
    if (Array.isArray(from)) {
      throw new Error(
        "ParabolaUniversalPathFinder does not support multiple start points"
      );
    }
    const curve = this.createCurve(from, to);
    return curve.getAllPoints().map((p) => this.gameMap.ref(Math.floor(p.x), Math.floor(p.y)));
  }
  next(from, to, speed) {
    if (this.lastTo !== to) {
      this.curve = this.createCurve(from, to);
      this.lastTo = to;
    }
    const nextPoint = this.curve.increment(speed ?? 1);
    if (!nextPoint) {
      return { status: 2 /* COMPLETE */, node: to };
    }
    const tile = this.gameMap.ref(
      Math.floor(nextPoint.x),
      Math.floor(nextPoint.y)
    );
    return { status: 0 /* NEXT */, node: tile };
  }
  invalidate() {
    this.curve = null;
    this.lastTo = null;
  }
  currentIndex() {
    return this.curve?.getCurrentIndex() ?? 0;
  }
  /** Flight progress, for game snapshots (see PathfinderSnapshots). */
  getState() {
    return {
      options: this.options ? { ...this.options } : null,
      lastTo: this.lastTo,
      curve: this.curve?.getState() ?? null
    };
  }
  setState(s) {
    this.options = s.options ?? void 0;
    this.lastTo = s.lastTo;
    this.curve = null;
    if (s.curve !== null) {
      const [p0, p1, p2, p3] = s.curve.points;
      this.curve = new DistanceBasedBezierCurve(
        p0,
        p1,
        p2,
        p3,
        this.options?.increment ?? 3
      );
      this.curve.setProgress(
        s.curve.currentIndex,
        s.curve.accumulatedDistanceScaled
      );
    }
  }
};

// packages/engine-lib/src/game/UnitGrid.ts
var UnitGrid = class {
  constructor(gm) {
    this.gm = gm;
    this.cellSize = 100;
    this.grid = Array(Math.ceil(gm.height() / this.cellSize)).fill(null).map(
      () => Array(Math.ceil(gm.width() / this.cellSize)).fill(null).map(() => /* @__PURE__ */ new Map())
    );
  }
  /**
   * Per cell (row-major), each type's units in set order. Entry order decides
   * query result order, and it is not derivable from the units themselves.
   */
  snapshot(unitRef) {
    const out = [];
    for (const row of this.grid) {
      for (const cell of row) {
        const entries = [];
        for (const [type, units] of cell) {
          entries.push([type, [...units].map((u) => unitRef(u))]);
        }
        out.push(entries);
      }
    }
    return out;
  }
  restoreSnapshot(cells, unit) {
    const width = this.grid[0]?.length ?? 0;
    cells.forEach((entries, i) => {
      const cell = this.grid[Math.floor(i / width)][i % width];
      for (const [type, refs] of entries) {
        cell.set(type, new Set(refs.map(unit)));
      }
    });
  }
  // Get grid coordinates from pixel coordinates
  getGridCoords(x, y) {
    return [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)];
  }
  // Add a unit to the grid
  addUnit(unit) {
    const tile = unit.tile();
    const [gridX, gridY] = this.getGridCoords(this.gm.x(tile), this.gm.y(tile));
    if (this.isValidCell(gridX, gridY)) {
      const unitSet = this.grid[gridY][gridX].get(unit.type());
      if (unitSet !== void 0) {
        unitSet.add(unit);
      } else {
        this.grid[gridY][gridX].set(unit.type(), /* @__PURE__ */ new Set([unit]));
      }
    }
  }
  // Remove a unit from the grid
  removeUnit(unit) {
    const tile = unit.tile();
    this.removeUnitByTile(unit, tile);
  }
  removeUnitByTile(unit, tile) {
    const [gridX, gridY] = this.getGridCoords(this.gm.x(tile), this.gm.y(tile));
    if (this.isValidCell(gridX, gridY)) {
      const unitSet = this.grid[gridY][gridX].get(unit.type());
      if (unitSet !== void 0) {
        unitSet.delete(unit);
      }
    }
  }
  /**
   * Move an unit to its new cell if it changed
   */
  updateUnitCell(unit) {
    const newTile = unit.tile();
    const oldTile = unit.lastTile();
    if (newTile === oldTile) return;
    const cs = this.cellSize;
    const gridX = Math.floor(this.gm.x(oldTile) / cs);
    const gridY = Math.floor(this.gm.y(oldTile) / cs);
    const newGridX = Math.floor(this.gm.x(newTile) / cs);
    const newGridY = Math.floor(this.gm.y(newTile) / cs);
    if (gridX !== newGridX || gridY !== newGridY) {
      this.removeUnitByTile(unit, oldTile);
      this.addUnit(unit);
    }
  }
  isValidCell(gridX, gridY) {
    return gridX >= 0 && gridX < this.grid[0].length && gridY >= 0 && gridY < this.grid.length;
  }
  // Compute the exact cells in range of tile
  getCellsInRange(tile, range) {
    const x = this.gm.x(tile);
    const y = this.gm.y(tile);
    const cellSize = this.cellSize;
    const [gridX, gridY] = this.getGridCoords(x, y);
    const startGridX = Math.max(
      0,
      gridX - Math.ceil((range - x % cellSize) / cellSize)
    );
    const endGridX = Math.min(
      this.grid[0].length - 1,
      gridX + Math.ceil((range - (cellSize - x % cellSize)) / cellSize)
    );
    const startGridY = Math.max(
      0,
      gridY - Math.ceil((range - y % cellSize) / cellSize)
    );
    const endGridY = Math.min(
      this.grid.length - 1,
      gridY + Math.ceil((range - (cellSize - y % cellSize)) / cellSize)
    );
    return { startGridX, endGridX, startGridY, endGridY };
  }
  squaredDistanceFromTile(unit, tile) {
    const x = this.gm.x(tile);
    const y = this.gm.y(tile);
    const tileX = this.gm.x(unit.tile());
    const tileY = this.gm.y(unit.tile());
    const dx = tileX - x;
    const dy = tileY - y;
    const distSquared = dx * dx + dy * dy;
    return distSquared;
  }
  // Get all units within range of a point
  // Returns [unit, distanceSquared] pairs for efficient filtering
  nearbyUnits(tile, searchRange, types, predicate, includeUnderConstruction = false) {
    const nearby = [];
    const gm = this.gm;
    const x = gm.x(tile);
    const y = gm.y(tile);
    const { startGridX, endGridX, startGridY, endGridY } = this.getCellsInRange(
      tile,
      searchRange
    );
    const rangeSquared = searchRange * searchRange;
    if (Array.isArray(types)) {
      for (let cy = startGridY; cy <= endGridY; cy++) {
        for (let cx = startGridX; cx <= endGridX; cx++) {
          const cell = this.grid[cy][cx];
          for (const type2 of types) {
            const unitSet = cell.get(type2);
            if (unitSet === void 0) continue;
            for (const unit of unitSet) {
              if (!unit.isActive()) continue;
              if (!includeUnderConstruction && unit.isUnderConstruction())
                continue;
              const unitTile = unit.tile();
              const dx = gm.x(unitTile) - x;
              const dy = gm.y(unitTile) - y;
              const distSquared = dx * dx + dy * dy;
              if (distSquared > rangeSquared) continue;
              const value = { unit, distSquared };
              if (predicate !== void 0 && !predicate(value)) continue;
              nearby.push(value);
            }
          }
        }
      }
      return nearby;
    }
    const type = types;
    for (let cy = startGridY; cy <= endGridY; cy++) {
      for (let cx = startGridX; cx <= endGridX; cx++) {
        const unitSet = this.grid[cy][cx].get(type);
        if (unitSet === void 0) continue;
        for (const unit of unitSet) {
          if (!unit.isActive()) continue;
          if (!includeUnderConstruction && unit.isUnderConstruction()) continue;
          const unitTile = unit.tile();
          const dx = gm.x(unitTile) - x;
          const dy = gm.y(unitTile) - y;
          const distSquared = dx * dx + dy * dy;
          if (distSquared > rangeSquared) continue;
          const value = { unit, distSquared };
          if (predicate !== void 0 && !predicate(value)) continue;
          nearby.push(value);
        }
      }
    }
    return nearby;
  }
  unitIsInRange(unit, tile, rangeSquared, playerId, includeUnderConstruction = false) {
    if (!unit.isActive()) {
      return false;
    }
    if (!includeUnderConstruction && unit.isUnderConstruction()) {
      return false;
    }
    if (playerId !== void 0 && unit.owner().id() !== playerId) {
      return false;
    }
    const distSquared = this.squaredDistanceFromTile(unit, tile);
    return distSquared <= rangeSquared;
  }
  // Return true if it finds an owned specific unit in range
  hasUnitNearby(tile, searchRange, type, playerId, includeUnderConstruction = false) {
    const { startGridX, endGridX, startGridY, endGridY } = this.getCellsInRange(
      tile,
      searchRange
    );
    const rangeSquared = searchRange * searchRange;
    for (let cy = startGridY; cy <= endGridY; cy++) {
      for (let cx = startGridX; cx <= endGridX; cx++) {
        const unitSet = this.grid[cy][cx].get(type);
        if (unitSet === void 0) continue;
        for (const unit of unitSet) {
          if (this.unitIsInRange(
            unit,
            tile,
            rangeSquared,
            playerId,
            includeUnderConstruction
          )) {
            return true;
          }
        }
      }
    }
    return false;
  }
  // Return true if any unit of the given types matches the predicate
  anyUnitNearby(tile, searchRange, types, predicate, playerId, includeUnderConstruction = false) {
    const { startGridX, endGridX, startGridY, endGridY } = this.getCellsInRange(
      tile,
      searchRange
    );
    const rangeSquared = searchRange * searchRange;
    for (let cy = startGridY; cy <= endGridY; cy++) {
      for (let cx = startGridX; cx <= endGridX; cx++) {
        for (const type of types) {
          const unitSet = this.grid[cy][cx].get(type);
          if (unitSet === void 0) continue;
          for (const unit of unitSet) {
            if (!this.unitIsInRange(
              unit,
              tile,
              rangeSquared,
              playerId,
              includeUnderConstruction
            )) {
              continue;
            }
            if (predicate(unit)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
};
export {
  ParabolaUniversalPathFinder,
  SAMLauncherExecution,
  UnitGrid
};
