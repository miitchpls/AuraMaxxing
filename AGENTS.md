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
These are public surfaces and survive game updates well. `api/dom.js`,
`api/settings.js`, `api/input.js`.

Tier 2 — main world. Game state lives on page objects a content script cannot
see, so `src/world/gameBridge.js` runs in the page world and answers queries over
a CustomEvent pair; `api/game.js` is the isolated-world client. This is the only
code that reads the game's internals and the only one expected to break on a
game update — keep it that way, and let the features that require it go dark
rather than spreading page-world access around.

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
await import("/AuraMaxxing/src/world/gameBridge.js");
await import("/AuraMaxxing/src/main.js");
```

The bridge is loaded separately because the manifest, not `main.js`, injects it —
skip it and every tier 2 feature reports itself unavailable.

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

## Server rate limits

The server drops intents past **10 per second** or **150 per minute**, and drops
them *silently* — no error, no retry, the action simply never happened
(`src/server/ClientMsgRateLimiter.ts`, enforced in `SocketIngress.ts`). An intent
over 2000 bytes, or 5MB sent in total, is a kick rather than a drop.

The per-minute figure is the real constraint: 150/min averages 2.5/s, so a burst
at 10/s runs dry in about fifteen seconds.

`api/intents.js` is the only way out to the server, and the only place that may
dispatch something the server sees — `api/input.js` keeps the input that stays in
the client. Everything queues there, so several features running at once cannot
exceed the limits between them, and it paces to a fraction of both so the player
keeps budget for their own moves. Never assume an intent landed.

Order of release is the `PRIORITY` array at the top of that file: most urgent
first, and anything not listed goes after, in arrival order. Keep the list short
— priority is strict, so a listed feature that queues without pause starves
everything below it. Pass the run's `AbortSignal` when queueing: an abandoned
entry is then dropped without spending a slot.

Batching beats pacing where the game offers it: the x5 build multiplier folds
five actions into one intent.

## Panel UI

There is one window, `AuraMaxxing`, and every feature is exactly one card inside
it. A feature calls `addSection({ id, title, body })` from `src/ui/panel.js` and
gets back a remove function for its `disable()`. It never creates a window, and
never positions, drags, or styles one.

The card is the only box a feature draws. Inside it go plain controls — do not
wrap groups of them in further bordered boxes, or one feature reads as three.

Two levels of collapse: the panel header hides every card, a card header hides
its own contents.

## Automation

Features that act on the user's behalf are individually toggleable and **off by
default**. They act through `api/input.js`, which dispatches synthetic events on
`window` — the same path a human input takes. The game's `InputHandler` matches
on `event.code` and `shiftKey` only and does not check `isTrusted`, and keybinds
are user configurable, so that module resolves the user's actual binding rather
than hardcoding keys.
