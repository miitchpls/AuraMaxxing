// One row per buildable thing: the key the game binds it to by default, the unit
// type string the game names it with, and where its x5 multiplier actually
// lands. The game honours that multiplier on the upgrade path for upgradable
// structures and, when building, for the atom bomb alone.
export const BUILDABLES = {
  buildCity: { key: "Digit1", unitType: "City", batching: "upgrade" },
  buildFactory: { key: "Digit2", unitType: "Factory", batching: "upgrade" },
  buildPort: { key: "Digit3", unitType: "Port", batching: "upgrade" },
  buildDefensePost: {
    key: "Digit4",
    unitType: "Defense Post",
    batching: "none",
  },
  buildMissileSilo: {
    key: "Digit5",
    unitType: "Missile Silo",
    batching: "upgrade",
  },
  buildSamLauncher: {
    key: "Digit6",
    unitType: "SAM Launcher",
    batching: "upgrade",
  },
  buildWarship: { key: "Digit7", unitType: "Warship", batching: "none" },
  buildAtomBomb: {
    key: "Digit8",
    unitType: "Atom Bomb",
    batching: "build",
    usesMissile: true,
  },
  buildHydrogenBomb: {
    key: "Digit9",
    unitType: "Hydrogen Bomb",
    batching: "none",
    usesMissile: true,
  },
  buildMIRV: {
    key: "Digit0",
    unitType: "MIRV",
    batching: "none",
    usesMissile: true,
  },
};

export const BUILD_ACTIONS = Object.keys(BUILDABLES);
