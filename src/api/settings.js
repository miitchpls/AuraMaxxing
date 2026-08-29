const KEYBINDS_KEY = "settings.keybinds";

export const available = () => {
  try {
    localStorage.getItem(KEYBINDS_KEY);
    return true;
  } catch {
    return false;
  }
};

export const keybinds = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYBINDS_KEY) ?? "{}");
  } catch {
    return {};
  }
};
