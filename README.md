# AuraMaxxing

Chrome extension for [OpenFront.io](https://openfront.io): bulk builds and
upgrades, build-under-cursor hotkeys, a SAM breach planner, a troop-growth peak
gauge, automatic alliances and ad removal.

Everything lives in one draggable panel, one card per feature. The cards only
open during a match.

## Features

Features that act for you are **off until you turn them on**.

| Feature | What it does |
| --- | --- |
| **BuildMaxxing** | Pick a structure and a count, click a tile: it builds or upgrades until the count is reached, buying the largest batch your gold allows. It waits for gold and for construction to finish, and paces bulk upgrades to the speed of the radial menu. |
| **FlashMaxxing** | While on, a build key builds right away under the cursor, with no click. Over one of your structures it upgrades it, like clicking the ghost structure. |
| **HippieMaxxing** | Sends alliance requests and extends expiring alliances on its own. |
| **BreachMaxxing** | Pick a target: it finds the cheapest atom-bomb salvo that gets through the SAMs defending it, with silo positions, levels, direction and gold cost. It simulates the game's own SAM code ([details](docs/breach-maxxing.md)) and sends nothing. |
| **PeakMaxxing** | Shows troop growth against its maximum, and where you sit relative to the troop count that maximises it. |
| **AdMaxxing** | Removes the ad containers and blocks the anti-adblock script, so the game runs with no banner and no nag. |

## Install

1. Download or clone this repository.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. **Load unpacked** and select the repository folder.

After an update, press reload on the extension's card and refresh the game tab.

## When OpenFront updates

OpenFront changes often and publishes no version to check against. On every
load each feature checks that what it needs is still there. If something is
missing, that feature turns itself off and logs one line in the console, and
the game and the other features keep working. A feature that goes missing
after a game update has been switched off, not broken.

## Server limits

OpenFront silently drops actions sent faster than 10 per second or 150 per
minute. Everything the extension sends goes through one shared queue that stays
under those limits. That is why an automatic action sometimes shows *pacing*.
Your own clicks don't go through the queue but count towards the same limit,
so heavy automation can still make one of your moves get dropped.

## Development

```sh
npm test                    # unit tests, no dependencies
```

BreachMaxxing bundles part of OpenFront's engine in `src/api/vendor/`. To check
it against the current game, clone this repository inside an
[OpenFront](https://github.com/openfrontio/OpenFrontIO) checkout, install the
game with Node 24 (`npm run inst`), then:

```sh
npm run test:breach-engine  # is the bundle current, and does the simulator match the engine?
npm run sync:breach-engine  # rebuild the bundle after a game update
```

[`CLAUDE.md`](CLAUDE.md) holds the architecture and the rules a change has to
follow.

## License

[AGPL-3.0](LICENSE). `src/api/vendor/openfront.js` is generated from OpenFront
and also carries OpenFront's additional terms
([`openfront-LICENSE`](src/api/vendor/openfront-LICENSE)).

Not affiliated with OpenFront.
