import * as dom from "./api/dom.js";
import panel from "./features/panel.js";

const api = { dom };
const features = [panel];

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
