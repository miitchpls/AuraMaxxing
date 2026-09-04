const LEFT_SIDEBAR = "game-left-sidebar";
const AD_CONTAINERS = [
  "#adBanner",
  "#pw-oop-flex_container",
  '[id^="pw-oop-left_rail"]',
  '[id^="pw-oop-right_rail"]',
  '[id^="pw-oop-bottom_rail"]',
  '[id^="pw-oop-corner_ad_video"]',
  "#in-game-promo-container",
].join(",");

export const available = () => document.querySelector(LEFT_SIDEBAR) !== null;

export const host = () => document.body;

export const adContainers = () => {
  const matches = [...document.querySelectorAll(AD_CONTAINERS)];
  return matches.filter(
    (element) =>
      !matches.some(
        (possibleParent) =>
          possibleParent !== element && possibleParent.contains(element),
      ),
  );
};
