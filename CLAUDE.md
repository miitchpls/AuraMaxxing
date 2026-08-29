# CLAUDE.md

Chrome extension (MV3) adding features to OpenFront. Its own git repository,
ignored by the OpenFront repo it sits inside.

## Principles

Use pragmatic, simplicity-first engineering principles (KISS/YAGNI), with
idiomatic code and minimal accidental complexity.

No abstraction without a second real use case, no config for a value that never
changes, no scaffolding "for later". The API layer is the one abstraction built
ahead of need, and it exists for a specific reason: to contain the blast radius
when the game changes.

## Git

- Never commit to `main` unless explicitly asked.
- Starting a new feature: first update the parent OpenFront repo (`git -C ..
  pull`) so the feature is written and tested against the current game. The API
  layer is only worth anything if it is aimed at the version people play.
- New feature → new branch `feature/<name>`. Commit freely there.
- On a feature branch, push right after every commit (`git push -u origin HEAD`
  on the first one) so `origin` is never behind. This does not apply to `main`.
- Any MR touching the UI includes **before and after** screenshots: same screen,
  same resolution, with and without the extension loaded. Non-UI changes need none.

## Style

- English everywhere: identifiers, strings, commit messages.
- No comments unless strictly necessary. A comment earns its place only by
  explaining a *why* the code cannot show — a quirk of the game, a constraint
  discovered the hard way. Never to restate what the next line does.
- Reach for a clearer name before reaching for a comment.

## Architecture

The game is under active development. DOM selectors, storage keys and keybinds
will change. Features must not feel that.

- A feature never touches `document.querySelector`, `localStorage`, or
  `dispatchEvent` against the game directly. It all goes through `src/api/`.
- Every game selector, storage key and keybind name appears exactly once, inside
  `src/api/`. A game update should mean editing `src/api/`, never the features.
- Features are independent: no feature imports another. If two need the same
  thing, that thing moves up into `src/api/` or `src/ui/`.
- Feature detection, not version detection — the game exposes no version
  anywhere. Every API module exports `available()` probing what it needs, and
  `src/main.js` skips features whose requirements do not answer.

```
content.js          bootstrap, dynamic-imports src/main.js
src/main.js         registry: probe requirements, enable features, contain failures
src/api/            the only code that knows anything about the game
src/features/       one file per feature, mutually independent
```

A feature is `{ id, name, requires, enable(api), disable() }`. `disable()` must
undo everything `enable()` did.

### API tiers

Tier 1 — stable surface. The DOM, `localStorage`, and synthetic input events.
These are public surfaces and survive game updates well. Only `api/dom.js`
exists so far; storage and input modules get written when a feature needs them,
not before.

Tier 2 — main world. Reading real game state requires injecting into the page
world and patching minified code; it will break on game deploys. When it is
needed it goes in a single sacrificial `api/game.js` with the same shape, so
only the features requiring it go dark.

## Testing in the game

Run the game from the parent repo (`npm run dev`, http://localhost:9000) and set
up the singleplayer game so nothing but the feature can fail. The options are
settable as properties on the `single-player-modal` element before starting:

- `nations = 0` — no nations, tribes only. Nation AI muddies what caused what.
- `infiniteGold = true` (or `startingGold` with a large `startingGoldValue`) —
  a build that silently does nothing because the player is short of gold looks
  exactly like a broken feature.
- `instantBuild = true` when the test is about issuing builds, not waiting.

### Loading the code under test

Chrome forbids extensions from touching `chrome://` pages, so only a human can
press reload on `chrome://extensions` — and a half-reloaded extension silently
mixes old and new modules, which reads as a nonsense error (`does not provide an
export named …`) rather than as a stale cache.

To avoid depending on that, run this **in the page console** when driving the
browser:

```js
await import("/AuraMaxxing/src/main.js");
```

This folder sits inside the root Vite serves, so it loads whatever is on disk
right now, with no reload step.

This is a test command only. It is never committed and never referenced by the
extension: `content.js` loads the same module graph from the extension's own
origin with `import(chrome.runtime.getURL("src/main.js"))`, and that is the real
path in production. The console command exists so a test does not depend on a
human clicking reload.

What it does not exercise is the isolated/page world split — it runs entirely in
the page world. A change to `src/world/gameBridge.js` or to `api/game.js` is only
trustworthy after a real extension reload, so ask for one.

Always read the page console after a test run. A module that fails to load, or a
feature that threw on enable, shows up there and nowhere else.

## Performance — non-negotiable

The game already saturates the GPU. The extension does no per-frame work.

- No `requestAnimationFrame` loops, no `MutationObserver` on wide subtrees, no
  layout reads (`offsetWidth`, `getBoundingClientRect`) in hot paths.
- Follow the map's pan/zoom with a CSS transform, never by redrawing.
- An overlay is computed once, drawn once, then shown and hidden.

## Never break the game

- Every feature entry point is wrapped: a failing feature disables itself and
  logs one line, the game keeps running.
- Our DOM ids, classes and storage keys are prefixed `auramaxxing-` / `am.` so
  they can never collide with the game's.
- Writing to the game's `localStorage`: only values valid against its Zod schema.
  `graphicsOverrides()` uses `safeParse` and silently returns `{}` on failure —
  one malformed value wipes every graphics setting the user has.

## Reusing the game's styling

Our elements live in the light DOM, so the game's stylesheet reaches them. We
ship no CSS of our own.

Only use Tailwind classes that already exist in the game's source. Tailwind 4
compiles only the classes it finds scanning the game's `src/`, and this folder is
gitignored so it is never scanned: an invented class produces nothing. Grep the
game's `src/` before using one that is not already here.

## Automation

Features that act on the user's behalf are individually toggleable and **off by
default**. They act through synthetic input events dispatched on `window` — the
same path a human input takes — behind an `api/input.js` written when the first
such feature lands. The game's `InputHandler` matches on `event.code` and
`shiftKey` only and does not check `isTrusted`, and keybinds are user
configurable, so that module must resolve the user's actual binding rather than
hardcode keys.
