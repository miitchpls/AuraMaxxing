import { simulate, trajectory } from "./breachSimulation.js";
export { simulate, trajectory } from "./breachSimulation.js";
export const available = () => true;
const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

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

const pause = () => new Promise((resolve) => setTimeout(resolve, 0));
export async function calculate(snapshot, { signal } = {}) {
  signal?.throwIfAborted();
  const owned = snapshot.silos
    .filter((s) => !s.underConstruction)
    .map((s) => ({ ...s, queue: [] }));
  if (!owned.length) return { status: "no-silos" };
  if (snapshot.bombCost == null || snapshot.siloCost == null)
    return { status: "no-prices" };
  const bombPrice = BigInt(snapshot.bombCost),
    siloPrice = BigInt(snapshot.siloCost);
  const ordered = [...owned].sort(
    (a, b) => manhattan(a, snapshot.target) - manhattan(b, snapshot.target),
  );
  const sites = [
    ...ordered.slice(0, 5),
    ...(snapshot.buildSites ?? []).map((p, i) => ({
      ...p,
      id: `planned-${i}`,
      level: 0,
      queue: [],
    })),
  ].slice(0, 5);
  const defense = {
    ...snapshot,
    sams: snapshot.sams.map((s) => ({ ...s, queue: [], upgrade: null })),
  };
  const maxBombs = 300,
    candidates = [],
    seen = new Set();
  const add = (sources, count) => {
    const key =
      `${count}:` + sources.map((s) => `${s.id}/${s.level}`).join(",");
    if (seen.has(key)) return;
    seen.add(key);
    const additions = sources.reduce(
      (n, s) =>
        n +
        Math.max(0, s.level - (owned.find((u) => u.id === s.id)?.level ?? 0)),
      0,
    );
    candidates.push({
      sources,
      count,
      additions,
      cost: BigInt(count) * bombPrice + BigInt(additions) * siloPrice,
    });
  };
  const capacity = owned.reduce((n, s) => n + s.level, 0);
  for (let count = 1; count <= Math.min(capacity, maxBombs); count++)
    add(owned, count);
  for (let number = 1; number <= sites.length; number++)
    for (let total = number; total <= maxBombs; total++) {
      const changes = sites.slice(0, number).map((s, i) => ({
        ...s,
        level: Math.max(
          s.level,
          Math.floor(total / number) + (i < total % number ? 1 : 0),
        ),
      }));
      const sources = owned.map((s) => changes.find((c) => c.id === s.id) ?? s);
      sources.push(...changes.filter((s) => !owned.some((u) => u.id === s.id)));
      add(sources, total);
      const incremental = sites
        .slice(0, number)
        .map((s) => ({ ...s, level: Math.max(1, s.level) }));
      let remaining = Math.max(
        0,
        total -
          capacity -
          incremental
            .filter((s) => !owned.some((u) => u.id === s.id))
            .reduce((n, s) => n + s.level, 0),
      );
      while (remaining-- > 0) {
        const smallest = incremental.reduce((a, b) =>
          a.level <= b.level ? a : b,
        );
        smallest.level++;
      }
      const reused = owned.map(
        (s) => incremental.find((c) => c.id === s.id) ?? s,
      );
      reused.push(
        ...incremental.filter((s) => !owned.some((u) => u.id === s.id)),
      );
      add(reused, total);
    }
  candidates.sort((a, b) =>
    a.cost < b.cost
      ? -1
      : a.cost > b.cost
        ? 1
        : a.count - b.count ||
          a.additions - b.additions ||
          a.sources.length - b.sources.length,
  );
  for (let i = 0; i < candidates.length; i++) {
    signal?.throwIfAborted();
    const candidate = candidates[i];
    for (const directionUp of [true, false]) {
      const bombs = makeSalvo(
        defense,
        candidate.sources,
        candidate.count,
        1,
        directionUp,
      );
      if (bombs.length !== candidate.count) continue;
      const outcome = simulate(defense, bombs);
      if (outcome.breached) {
        const used = new Set(bombs.map((b) => b.silo));
        const sources = candidate.sources.filter(
          (s) =>
            used.has(s.id) ||
            s.level > (owned.find((u) => u.id === s.id)?.level ?? 0),
        );
        return {
          status: "ready",
          maxBombs,
          plan: {
            bombs: candidate.count,
            cost: String(candidate.cost),
            directionUp,
            levels: sources.map((s) => s.level),
            positions: sources.map((s) => ({ x: s.x, y: s.y })),
            orderIntervalSeconds: snapshot.rules.msPerTick / 1000,
            orderSeconds:
              ((Math.ceil(candidate.count / 5) - 1) *
                snapshot.rules.msPerTick) /
              1000,
          },
        };
      }
    }
    if (i % 8 === 0) await pause();
  }
  return { status: "not-found", maxBombs };
}
