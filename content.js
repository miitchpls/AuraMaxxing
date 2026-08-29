import(chrome.runtime.getURL("src/main.js")).catch((error) =>
  console.error("[AuraMaxxing] failed to load", error),
);
