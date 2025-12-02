import assert from "node:assert";
import { ZeroAdNetwork, FEATURES, SERVER_HEADERS, CLIENT_HEADERS } from "../dist/index.mjs";

(() => {
  const zeroAd = ZeroAdNetwork({
    siteId: "EF005186-B911-4D77-83BD-A7D4E93F6124",
    features: [FEATURES.ADS_OFF],
  });

  assert.equal(zeroAd.SERVER_HEADER_NAME, SERVER_HEADERS.WELCOME.toLowerCase());
  assert.equal(zeroAd.CLIENT_HEADER_NAME, CLIENT_HEADERS.HELLO.toLowerCase());
  // cspell:disable-next-line
  assert.equal(zeroAd.SERVER_HEADER_VALUE, "7wBRhrkRTXeDvafU6T9hJA^1^1");

  const validExpiredToken =
    "AbXze/EaFy9pEwAAAA==.hQHwRDR4i8wCV8+gYUxgFGd2yXHUMORnhetz+5Aloc84d3vz1dyGi3GDZ5Y4USc2RemCzYaKLltsi+Iu6NJMAQ==";

  assert.deepEqual(zeroAd.parseToken(validExpiredToken), {
    ADS_OFF: false,
    COOKIE_CONSENT_OFF: false,
    MARKETING_DIALOG_OFF: false,
    CONTENT_PAYWALL_OFF: false,
    SUBSCRIPTION_ACCESS_ON: false,
  });

  console.info("Passed.");
})();
