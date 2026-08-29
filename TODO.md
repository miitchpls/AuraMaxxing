# TODO

Ideas not yet built. Sketches, not decisions.

## Build safeguard

An on/off toggle. While on, it refuses to place structures too close to each
other, keeping at least the blast radius of the small nuke plus some margin
between them, so nobody takes out several of your structures with one shot.

## BreachMaxxing

Activate the mode, click a point on the map, and it tells you how many light
nukes you need to get through there. With a single SAM you can read its level
and know it is level + 1, but when several SAMs cover the same point their
ranges overlap and there is no way to see, for that exact spot, how many nukes
it takes. So it takes the coordinate and reports how many SAMs actually cover it
and how many bombs are needed to breach.

## WakeMaxxing

Players send sleeping cells: at the start of a game they click somewhere far
away and land a single troop there, keeping a hidden pocket of territory. This
warns you when a sleeping cell is sitting near you.

## HippieMaxxing

An on/off toggle. Turning it on sends an alliance request to everyone, and while
it stays on it keeps accepting alliance renewal requests and sending them out to
other players.

## Cheap structure loop

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

## Player density heatmap

A toggle that shows a heatmap of where players are spread across the map, so at
the start of a game you can see which areas are crowded and which are empty.

A version that also weighs the terrain to suggest a best spawn point was
considered, but empty ground is not automatically better: an area with nobody in
it means no trade early on.
