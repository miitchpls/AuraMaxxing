import assert from "node:assert/strict";

import { removeAds, restoreAds } from "../src/features/adMaxxing.js";

const parent = { child: null };
const replace = (current, replacement) => {
  assert.equal(parent.child, current);
  parent.child = replacement;
  current.isConnected = false;
  replacement.isConnected = true;
};
const ad = {
  id: "pw-oop-left_rail",
  isConnected: true,
  contains: () => false,
  replaceWith(replacement) {
    replace(this, replacement);
  },
};
parent.child = ad;

globalThis.document = {
  createComment: () => ({
    isConnected: false,
    replaceWith(replacement) {
      replace(this, replacement);
    },
  }),
  querySelectorAll: () => (parent.child === ad ? [ad] : []),
};

removeAds();
assert.notEqual(parent.child, ad);
assert.equal(ad.isConnected, false);

restoreAds();
assert.equal(parent.child, ad);
assert.equal(ad.isConnected, true);

console.log("adMaxxing ok");
