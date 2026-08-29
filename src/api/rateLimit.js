// The server drops intents past 10 per second or 150 per minute, silently: the
// action simply never happened, with no error and no retry. We stay well under
// both so an automated run cannot spend the budget the player needs for their
// own moves.
const BUDGET_PER_SECOND = 5;
const BUDGET_PER_MINUTE = 100;
const SECOND_MS = 1000;
const MINUTE_MS = 60000;

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

const sent = [];

export const reserveIntent = async (onWait) => {
  let waited = false;
  for (;;) {
    const now = Date.now();
    while (sent.length > 0 && now - sent[0] >= MINUTE_MS) sent.shift();

    const delay = nextSlotDelay(sent, now);
    if (delay <= 0) {
      sent.push(now);
      return waited;
    }
    if (!waited) {
      waited = true;
      onWait?.();
    }
    await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 500)));
  }
};
