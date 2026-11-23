# BreachMaxxing

Read-only atom-bomb calculator. Select a target or recalculate to get one passing
configuration, its direction, positions, gold cost and order timing. No builds
or launch intents are sent.

The sandbox runs copies of OpenFront's SAM launcher, targeting, interceptor,
spatial grid and air-path code. Nuke movement and silo scheduling are adapted to
that sandbox. `npm run sync:breach-engine` regenerates the browser bundle from the
parent game; the generated manifest records source hashes, including the game
code governing the adapter and prices. No parent imports are needed at runtime.
The copied code retains OpenFront's AGPL license in `src/api/vendor/`.

Every hostile SAM starts fully loaded at its level's full range, regardless of
current reload or upgrade progress. Reloads, competing SAMs, target reservations
and interceptor travel then follow the game engine. Both arcs are tested; a
breach requires an actual surviving impact, not just an unreserved missile.

Plans are tested in ascending gold cost: bombs plus additional silo levels at
the prices quoted by the game. Existing levels are not charged again. The search
reuses existing silos and compares balanced and incremental upgrades across up
to five sites, with at most 300 bombs. The sites are the nearest existing silos,
then up to four empty buildable positions near the closest silo. Ownership,
terrain, bounds and structure spacing are checked. Other existing silos remain
in the simulation because the game chooses the nearest available launcher.
The result is the cheapest passing plan among these candidates, not a global
optimum over every possible position and distribution of levels.

The plan uses one ×5 order per tick (currently 100 ms) and assumes every order is
accepted. Existing missiles, other attacks, new construction and alliance changes
are excluded. Initial silo ammunition is full. Failure within the search bound
does not mean no breach is possible. The calculator does not implement Burst.

## Verification

- `npm test`: calculator, cost ordering, bridge snapshot, input cleanup and
  existing features.
- `npm run test:breach-engine`: checks vendored source freshness, then 13 scenarios
  against the parent OpenFront engine. Compares trajectories point for point,
  SAM launch ticks and targets, first impact tick and breach outcome. Requires
  the parent repo's installed dependencies. Verified against `31937823c`.
- Browser fixture: singleplayer, no nations or tribes, infinite gold and instant
  builds; one enemy SAM 100 and own silos 50 and 51. Software rendering was
  enabled only in the test browser to allow the headless local run.

For the test target 600 tiles east of the first silo, 50+51 and 51+51 are blocked;
52+51 and 34+34+33 breach with ×5 orders every tick. With existing 50+51 silos,
52+51 and 103 bombs cost 79.25M additional gold. Starting from one level-1 silo,
the candidate search prefers 34+34+33 and 101 bombs at 175.75M. These are fixture
results, not universal formulas: moving the launch site changes the outcome.

Page-world imports exercise the real game and panel but do not validate Chrome's
isolated-world boundary. A real extension reload is required for that last check.
