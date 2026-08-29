// The one way out to the server. Everything that reaches it queues here, so
// several features running at once cannot exceed the limits between them.
//
// The server drops intents past 10 per second or 150 per minute, silently: the
// action simply never happened, with no error and no retry. These budgets stay
// under that, because the same allowance also carries the player's own moves.
const BUDGET_PER_SECOND = 5;
const BUDGET_PER_MINUTE = 100;
const SECOND_MS = 1000;
const MINUTE_MS = 60000;

// Ordered by urgency, most urgent first. Listing every feature is not required:
// anything absent goes after the listed ones, in arrival order. Keep it short —
// a listed feature that queues without pause starves everything below it.
const PRIORITY = ["buildMaxxing"];

export const available = () => true;

// `times` must be the send timestamps of the last minute, oldest first.
export const nextSlotDelay = (times, now) => {
  const recent = times.filter((time) => now - time < SECOND_MS);
  if (recent.length >= BUDGET_PER_SECOND) {
    return SECOND_MS - (now - recent[0]);
  }
  if (times.length >= BUDGET_PER_MINUTE) {
    return MINUTE_MS - (now - times[0]);
  }
  return 0;
};

export const rankOf = (featureId, priority) => {
  const index = priority.indexOf(featureId);
  return index === -1 ? priority.length : index;
};

export const pickNext = (entries, priority) => {
  let best = -1;
  for (let i = 0; i < entries.length; i++) {
    if (best === -1) {
      best = i;
      continue;
    }
    const rank = rankOf(entries[i].featureId, priority);
    const bestRank = rankOf(entries[best].featureId, priority);
    if (rank < bestRank || (rank === bestRank && entries[i].seq < entries[best].seq)) {
      best = i;
    }
  }
  return best;
};

const sent = [];
const queue = [];
let nextSeq = 0;
let pumping = false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pump = async () => {
  if (pumping) return;
  pumping = true;
  try {
    while (queue.length > 0) {
      const index = pickNext(queue, PRIORITY);
      const entry = queue[index];

      // An abandoned entry costs nothing: dropping it must not spend a slot the
      // player or another feature could still use.
      if (entry.signal?.aborted) {
        queue.splice(index, 1);
        entry.reject(entry.signal.reason);
        continue;
      }

      const now = Date.now();
      while (sent.length > 0 && now - sent[0] >= MINUTE_MS) sent.shift();
      const delay = nextSlotDelay(sent, now);
      if (delay > 0) {
        entry.onWait?.();
        entry.onWait = undefined;
        await wait(Math.min(delay, 500));
        continue;
      }

      queue.splice(index, 1);
      sent.push(now);
      try {
        entry.resolve(entry.run());
      } catch (error) {
        entry.reject(error);
      }
    }
  } finally {
    pumping = false;
  }
};

export const enqueue = (featureId, run, { signal, onWait } = {}) =>
  new Promise((resolve, reject) => {
    queue.push({ featureId, run, signal, onWait, seq: nextSeq++, resolve, reject });
    pump();
  });

const sendEnter = () =>
  window.dispatchEvent(
    new KeyboardEvent("keydown", { code: "Enter", bubbles: true }),
  );

export const confirmBuild = (featureId, options) =>
  enqueue(featureId, sendEnter, options);
