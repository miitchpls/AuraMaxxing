const distanceSquared = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
export const available = () => true;

// Fixed-point subdivision must match OpenFront's DistanceBasedBezierCurve:
// sampling the same curve with floating-point steps changes interception ticks.
export function trajectory(from, to, rules, directionUp = true) {
  const dx = to.x - from.x,
    dy = to.y - from.y;
  const height = Math.max(Math.hypot(dx, dy) / 3, 50) * (directionUp ? -1 : 1);
  const clamp = (y) => Math.max(0, Math.min(rules.height - 1, y));
  const points = [
    from,
    { x: from.x + dx / 4, y: clamp(from.y + dy / 4 + height) },
    { x: from.x + (dx * 3) / 4, y: clamp(from.y + (dy * 3) / 4 + height) },
    to,
  ].map((p) => [Math.round(p.x) * 256, Math.round(p.y) * 256]);
  const path = [{ ...from }];
  let last = points[0],
    accumulated = 0;
  const spacing = Math.max(256, Math.round(rules.nukeSpeed * 256));
  const middle = (a, b) => [(a[0] + b[0]) >> 1, (a[1] + b[1]) >> 1];
  const subdivide = (a, b, c, d, depth) => {
    const length =
      Math.abs(b[0] - a[0]) +
      Math.abs(b[1] - a[1]) +
      Math.abs(c[0] - b[0]) +
      Math.abs(c[1] - b[1]) +
      Math.abs(d[0] - c[0]) +
      Math.abs(d[1] - c[1]);
    if (length <= 256 || depth >= 10) {
      accumulated += Math.floor(
        Math.sqrt((a[0] - last[0]) ** 2 + (a[1] - last[1]) ** 2),
      );
      last = a;
      while (accumulated >= spacing) {
        path.push({ x: (a[0] + 128) >> 8, y: (a[1] + 128) >> 8 });
        accumulated -= spacing;
      }
      return;
    }
    const ab = middle(a, b),
      bc = middle(b, c),
      cd = middle(c, d);
    const abc = middle(ab, bc),
      bcd = middle(bc, cd),
      center = middle(abc, bcd);
    subdivide(a, ab, abc, center, depth + 1);
    subdivide(center, bcd, cd, d, depth + 1);
  };
  subdivide(...points, 0);
  if (path.at(-1).x !== to.x || path.at(-1).y !== to.y) path.push({ ...to });
  return path.map((p) => ({
    ...p,
    targetable:
      distanceSquared(p, from) < rules.targetableRange ** 2 ||
      distanceSquared(p, to) < rules.targetableRange ** 2,
  }));
}

function rangeAt(sam, tick) {
  if (!sam.upgrade || tick >= sam.upgrade.end) return sam.range;
  const { start, end, from } = sam.upgrade;
  return (
    from + ((sam.range - from) * Math.max(0, tick - start)) / (end - start)
  );
}

export function makeSalvo(snapshot, silos, count, gap = 1, directionUp = true) {
  const { target, rules } = snapshot;
  const ordered = silos
    .map((s) => ({
      ...s,
      queue: [...s.queue],
      path: trajectory(s, target, rules, directionUp),
    }))
    .sort((a, b) => manhattan(a, target) - manhattan(b, target));
  const bombs = [];
  let processedTick = -1;
  for (let i = 0; i < count; i++) {
    const created = Math.floor(i / 5) * gap + 2;
    while (processedTick < created) {
      processedTick++;
      for (const silo of ordered) {
        if (
          silo.queue.length &&
          processedTick - silo.queue[0] >= rules.siloCooldown
        )
          silo.queue.shift();
      }
    }
    const silo = ordered.find((s) => s.queue.length < s.level);
    if (!silo) continue;
    let lastDeparture = 0;
    for (const tick of silo.queue)
      lastDeparture = Math.max(tick + 1, lastDeparture + 1);
    const firstMotion = Math.max(created, lastDeparture) + 1;
    bombs.push({
      id: i,
      silo: silo.id,
      created,
      firstMotion,
      path: silo.path,
      impact: firstMotion + silo.path.length - 2,
    });
    silo.queue.push(created);
  }
  return bombs;
}

export function simulate(snapshot, bombs) {
  const { rules } = snapshot;
  const sams = [];
  const candidates = [];
  for (const sam of snapshot.sams) {
    const paths = new Map();
    const reachable = new Set();
    for (const bomb of bombs) {
      if (!paths.has(bomb.path))
        paths.set(
          bomb.path,
          bomb.path.some(
            (p) => p.targetable && distanceSquared(p, sam) <= sam.range ** 2,
          ),
        );
      if (paths.get(bomb.path)) reachable.add(bomb.id);
    }
    if (!reachable.size) continue;
    sams.push({ ...sam, queue: [...sam.queue], cache: new Map(), shots: 0 });
    candidates.push(reachable);
  }
  const stopped = new Set();
  const lastTick = Math.max(0, ...bombs.map((b) => b.impact));
  for (let tick = 0; tick <= lastTick; tick++) {
    for (let si = 0; si < sams.length; si++) {
      const sam = sams[si];
      sam.queue = sam.queue.filter((t) => tick - t < rules.samCooldown);
      if (sam.queue.length >= sam.level) continue;
      const targets = [];
      for (const bomb of bombs) {
        if (
          stopped.has(bomb.id) ||
          !candidates[si].has(bomb.id) ||
          tick <= bomb.created ||
          tick > bomb.impact
        )
          continue;
        const index = Math.max(0, tick - bomb.firstMotion);
        const current = bomb.path[Math.min(index, bomb.path.length - 1)];
        if (distanceSquared(current, sam) > (rules.maxSamRange * 4) ** 2)
          continue;
        const cached = sam.cache.get(bomb.id);
        if (cached === -1) continue;
        if (cached !== undefined && cached > tick + 1) continue;
        if (cached !== undefined && cached >= tick) {
          targets.push({ bomb, index });
          sam.cache.delete(bomb.id);
          continue;
        }
        const wait = Math.max(0, bomb.firstMotion - 1 - tick);
        let shot = -1,
          increases = 0,
          lastDistance = -1;
        for (let i = index; i < bomb.path.length - 1; i++) {
          const p = bomb.path[i],
            dist = distanceSquared(p, sam);
          increases =
            lastDistance !== -1 && dist > lastDistance ? increases + 1 : 0;
          lastDistance = dist;
          const nukeTicks = i - index + wait,
            samTicks = Math.ceil(manhattan(sam, p) / rules.samSpeed);
          if (
            p.targetable &&
            dist <= rangeAt(sam, tick + nukeTicks) ** 2 &&
            nukeTicks >= samTicks
          ) {
            shot = tick + nukeTicks - samTicks;
            break;
          }
          if (increases > 3 && dist > rules.maxSamRange ** 2) break;
        }
        if (shot < 0) {
          const end = bomb.path.at(-1),
            penultimate = bomb.path.at(-2);
          const remaining = bomb.path.length - 2 - index + wait;
          const samTicks = penultimate
            ? Math.ceil(manhattan(sam, penultimate) / rules.samSpeed)
            : Infinity;
          if (
            end.targetable &&
            penultimate?.targetable &&
            distanceSquared(sam, end) <=
              rangeAt(sam, tick + remaining + 1) ** 2 &&
            remaining >= samTicks
          )
            shot = tick + remaining - samTicks;
        }
        if (shot >= tick && shot <= tick + 1) targets.push({ bomb, index });
        else sam.cache.set(bomb.id, shot);
      }
      targets.sort(
        (a, b) =>
          Math.max(0, 10000 - (b.bomb.path.length - b.index) * 100) -
          Math.max(0, 10000 - (a.bomb.path.length - a.index) * 100),
      );
      for (const { bomb } of targets) {
        if (sam.queue.length >= sam.level) break;
        stopped.add(bomb.id);
        sam.queue.push(tick);
        sam.shots++;
      }
    }
    const impact = bombs.find((b) => b.impact === tick && !stopped.has(b.id));
    if (impact)
      return {
        breached: true,
        firstImpact: tick,
        shots: sams.map((s) => ({ id: s.id, shots: s.shots })),
      };
  }
  return {
    breached: false,
    firstImpact: null,
    shots: sams.map((s) => ({ id: s.id, shots: s.shots })),
  };
}

const pause = () => new Promise((resolve) => setTimeout(resolve, 0));
export async function calculate(
  snapshot,
  { gap = 1, directionUp = true, signal } = {},
) {
  const silos = snapshot.silos.filter((s) => !s.underConstruction);
  if (!silos.length) return { status: "no-silos" };
  const anchor = [...silos].sort(
    (a, b) => manhattan(a, snapshot.target) - manhattan(b, snapshot.target),
  )[0];
  const ready = silos.reduce(
    (sum, s) => sum + Math.max(0, s.level - s.queue.length),
    0,
  );
  const maxBombs = 300;
  const check = (sources, count) => {
    signal?.throwIfAborted();
    const bombs = makeSalvo(snapshot, sources, count, gap, directionUp);
    const result = simulate(snapshot, bombs);
    return {
      ...result,
      bombs: count,
      launched: bombs.length,
      orderSeconds:
        (Math.max(0, Math.ceil(count / 5) - 1) *
          gap *
          snapshot.rules.msPerTick) /
        1000,
      departureSeconds: bombs.length
        ? ((Math.max(...bombs.map((b) => b.firstMotion)) -
            Math.min(...bombs.map((b) => b.firstMotion))) *
            snapshot.rules.msPerTick) /
          1000
        : 0,
    };
  };
  const current = check(silos, Math.min(ready, maxBombs));
  if (current.breached) {
    let low = 1,
      high = Math.min(ready, maxBombs);
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (check(silos, mid).breached) high = mid;
      else low = mid + 1;
      await pause();
    }
    Object.assign(current, check(silos, low));
  }
  const recommendations = [];
  // These are balanced, adjacent layouts at the closest silo, not arbitrary
  // placements. Keeping that constraint explicit avoids a false global minimum.
  for (let number = 1; number <= 5; number++) {
    let found = null;
    for (let total = 1; total <= maxBombs; total++) {
      if (total < number) continue;
      const hypothetical = Array.from({ length: number }, (_, i) => ({
        ...anchor,
        id: `planned-${i}`,
        level: Math.floor(total / number) + (i < total % number ? 1 : 0),
        queue: [],
        x: anchor.x,
        y: anchor.y + i * snapshot.rules.structureSpacing,
      }));
      if (hypothetical.some((s) => s.y >= snapshot.rules.height)) break;
      const result = check(hypothetical, total);
      if (result.breached) {
        found = {
          ...result,
          levels: hypothetical.map((s) => s.level),
          positions: hypothetical.map((s) => ({ x: s.x, y: s.y })),
        };
        break;
      }
      if (total % 8 === 0) await pause();
    }
    recommendations.push({ silos: number, plan: found });
    await pause();
  }
  return {
    status: "ready",
    current,
    recommendations,
    ready,
    maxBombs,
    anchor,
    gap,
    directionUp,
  };
}
