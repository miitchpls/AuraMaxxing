# TODO

Ideas not yet built. Sketches, not decisions.

## CovidMaxxing

An on/off toggle. While on, it refuses to place structures too close to each
other, keeping at least the blast radius of the small nuke plus some margin
between them, so nobody takes out several of your structures with one shot.

## BreachMaxxing — remaining work

The read-only calculator is implemented. Extend the bounded layout search to
player-selected launch sites and account for missiles already in flight.

Burst execution of the selected plan is a separate follow-up. It must observe
accepted launches and invalidate a plan when defenses or launch timing change.

## WakeMaxxing

Players send sleeping cells: at the start of a game they click somewhere far
away and land a single troop there, keeping a hidden pocket of territory. This
warns you when a sleeping cell is sitting near you.

## BrokeMaxxing

Structure prices climb with how many you already own: the first city costs 125k,
the second 250k, and so on. Losing a structure drops the count, so the next one
is cheap again.

A mode that farms this at the start of a game. It spawns next to a tribe and
holds a deliberate balance: few enough troops that the tribe keeps attacking it,
enough gold to keep rebuilding. Place a cheap structure near the border, let the
tribe take it, place another one at the same low price, and retake the territory
before the structures get deleted. The result is a lot of early structures for
far less gold than paying the rising price.

It needs a rough model of how the tribe AI decides to attack, and probably
reading tribe ids out of the game state in the browser.

## SmartMaxxing

A toggle that shows a heatmap of where players are spread across the map, so at
the start of a game you can see which areas are crowded and which are empty.

A version that also weighs the terrain to suggest a best spawn point was
considered, but empty ground is not automatically better: an area with nobody in
it means no trade early on.

## PeakMaxxing

Troops are generated along a bell curve. Read that algorithm and use it to tell
you the best moments to attack: stay at the peak of the curve and attack with
the troop percentage that keeps you there. Sitting at the peak and then
attacking with 70% is not sustainable, because it drops you off the curve.

Could be automatic attacking, or purely visual indicators showing the same
information and leaving the attack to you.

## DEFCONMaxxing

Something that warns you about dangers, lighting up indicators as they build up.

Example: you hold a dense cluster of structures behind a level 5 SAM, and there
is a player in the game with at least 6 missile silos, so they can punch through
it — medium warning. If that player then gets close to the gold needed to fire
enough bombs, the danger level rises.

## BlueprintMaxxing

A catalogue of building layouts. Each entry shows a picture of the arrangement
and its price — a small block of cities and factories, for instance. Click one
and, if there is enough room, it builds the structures according to that preset.
Presets you cannot currently afford appear disabled.

## SecretaryMaxxing

Something that fires messages on its own when a condition is met. First one
could be sending an SOS emoji to allies when you are under attack and low on
troops. The rest of the triggers are still to be defined.
