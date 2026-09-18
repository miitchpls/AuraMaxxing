# BreachMaxxing

Read-only atom-bomb calculator. Select a point, choose the ×5 order cadence and
arc direction, then recalculate when the battle changes. No builds or launch
intents are sent.

The calculator snapshots the current game configuration, silo positions and
ammunition queues, hostile SAM positions, levels, upgrade ranges and independent
reload timers. It reproduces the fixed-point trajectory, nearest-silo selection,
per-silo departure spacing and SAM targeting windows. Overlapping SAMs reserve
targets so the same bomb is not counted twice. A successful SAM reservation is
assumed to intercept; interference with the interceptor itself is not modeled.

The result is an estimate assuming all orders arrive at the selected cadence.
Server drops, other attacks, new construction, ownership changes and alliance
changes can invalidate it. Existing missiles in flight are disclosed but excluded.
A target owned by a friendly player is unsupported. Gold and current launch
availability are displayed separately from the trajectory result.

The layout search tests one through five fully loaded silos, balanced levels,
and at most 300 bombs. It starts at the closest existing silo and places the
others south of it at the game's minimum structure spacing plus one tile. Map
bounds are checked; ownership, terrain and build space still need checking.
The displayed minimum is only within that layout family and search bound.
It is not a global minimum across arbitrary positions. A failed bounded search
does not imply the target can never be breached.

## Verification

- `npm test`: calculator, bridge snapshot, input cleanup, existing features.
- `npm run test:breach-engine`: 13 scenarios against the parent OpenFront engine;
  also checks generated trajectories point for point. Requires the parent repo's
  installed dependencies. Verified against `31937823c`.
- Browser fixture: singleplayer, no nations or tribes, infinite gold and instant
  builds; one enemy SAM 100 and own silos 50 and 51. Software rendering was
  enabled only in the test browser to allow the headless local run.

For a target 600 tiles east of the first silo, with the second 16 tiles south,
using ×5 orders every tick (100 ms): 50+51 and 51+51 are blocked; 52+51 and
34+34+33 breach. All orders at the same tick can make 50+51 breach, but that is
not a server delivery guarantee. Moving the launch site changes the outcome.

Page-world imports exercise the real game and panel but do not validate Chrome's
isolated-world boundary. A real extension reload is required for that last check.

## Screenshots

Same local fixture and 1400 × 1000 viewport. The startup launch restriction is
shown separately from the calculated breach estimate. The three units remain
unchanged after selecting the target; the extension logs no runtime errors.

![Without AuraMaxxing](images/breach-before.png)

![With BreachMaxxing](images/breach-after.png)
