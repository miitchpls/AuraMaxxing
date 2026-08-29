import * as dom from "./api/dom.js";
import * as game from "./api/game.js";
import * as input from "./api/input.js";
import * as rateLimit from "./api/rateLimit.js";
import buildMaxxing from "./features/buildMaxxing.js";

const api = { dom, game, input, rateLimit };
const features = [buildMaxxing];

for (const feature of features) {
  const missing = feature.requires.filter((name) => !api[name].available());
  if (missing.length > 0) {
    console.warn(
      `[AuraMaxxing] ${feature.id} disabled, unavailable: ${missing.join(", ")}`,
    );
    continue;
  }
  try {
    feature.enable(api);
  } catch (error) {
    console.error(`[AuraMaxxing] ${feature.id} failed to enable`, error);
    try {
      feature.disable();
    } catch {
      // A feature that cannot even clean up must not take the page down.
    }
  }
}
