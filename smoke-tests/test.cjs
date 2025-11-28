const assert = require("node:assert");
const {
  init,
  getServerHeaderName,
  getServerHeaderValue,
  processRequest,
  getClientHeaderName,
  SERVER_HEADERS,
  CLIENT_HEADERS,
  SITE_FEATURES,
  PROTOCOL_VERSION,
} = require("../dist/index.cjs");

(() => {
  const siteId = "EF005186-B911-4D77-83BD-A7D4E93F6124";
  init({ siteId, features: [SITE_FEATURES.AD_LESS_EXPERIENCE] });

  assert.equal(getServerHeaderName(), SERVER_HEADERS.WELCOME);
  assert.equal(getClientHeaderName(), CLIENT_HEADERS.HELLO);
  // cspell:disable-next-line
  assert.equal(getServerHeaderValue(), "7wBRhrkRTXeDvafU6T9hJA^1^1");

  const result = processRequest(
    "Aav2IXRoh0oKBw==.2yZfC2/pM9DWfgX+von4IgWLmN9t67HJHLiee/gx4+pFIHHurwkC3PCHT1Kaz0yUhx3crUaxST+XLlRtJYacAQ=="
  );

  assert.deepEqual(result._raw, {
    expiresAt: new Date("2025-07-28T09:59:38.000Z"),
    version: PROTOCOL_VERSION.V_1,
    expired: true,
    flags: 7,
  });

  assert.equal(result.shouldRemoveAds, false);
  assert.equal(result.shouldEnablePremiumContentAccess, false);
  assert.equal(result.shouldEnableVipExperience, false);
})();
