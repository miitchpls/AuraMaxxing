# TODO

Ideas not yet built. Each one is a sketch, not a decision.

## Build safeguard

An on/off toggle. While on, it refuses to place a structure too close to another
of yours, so a single nuke cannot take out several at once.

### What the game actually does

- `Config.ts` — atom bomb magnitude is `{ inner: 12, outer: 30 }`.
- `NukeExecution.ts` — a unit is destroyed when it falls within the **outer**
  radius, not the inner one. Inner only decides how certainly the *territory*
  burns.

So one atom bomb clears every structure within 30 tiles of where it lands.

### The catch

A strict guarantee therefore needs more than **60 tiles** between any two
structures — two blast radii — plus margin. That is a large distance on most
maps and may be unusable as a hard rule.

Options, to decide when building it:

- Make the spacing configurable, defaulting to something around a single blast
  radius (30 + margin). That does not guarantee separation, but it stops the
  tight clusters that die to one bomb.
- Or keep 60+ as the rule and accept it only applies to large territories.

Either way the panel should say *why* a placement was refused, and show the
distance to the nearest own structure, rather than silently blocking a click.

### Implementation notes

- Needs tier 2 (`api/game.js`): the check requires knowing where the player's
  own structures are, which is not in the DOM.
- The check runs before confirming a build, so it also has to hook whatever
  BuildMaxxing does per batch — worth designing so both a manual placement and
  an automated run go through the same guard.
- Toggle lives in its own card, per the one-card-per-feature rule. It is a
  guard, not automation, so it may default to on once it has been proven.
