import { describe, test, expect } from "bun:test";
import { ZeroAdNetwork, CLIENT_HEADERS, FEATURES, SERVER_HEADERS } from "../index";

describe("module", () => {
  const validButExpiredClientHeaderValue =
    "Aav2IXRoh0oKBw==.2yZfC2/pM9DWfgX+von4IgWLmN9t67HJHLiee/gx4+pFIHHurwkC3PCHT1Kaz0yUhx3crUaxST+XLlRtJYacAQ==";

  describe("Default export", () => {
    const siteId = "073C3D79-B960-4335-B948-416AC1E3DBD4";

    test("should generate a valid server header", () => {
      const zeroAd = ZeroAdNetwork({ siteId, features: [FEATURES.ADS_OFF, FEATURES.COOKIE_CONSENT_OFF] });
      expect(zeroAd.SERVER_HEADER_NAME).toEqual(SERVER_HEADERS.WELCOME.toLowerCase());
      // cspell:disable-next-line
      expect(zeroAd.SERVER_HEADER_VALUE).toBe("Bzw9eblgQzW5SEFqwePb1A^1^3");
    });

    test("should contain correct client hello header name", () => {
      const zeroAd = ZeroAdNetwork({ siteId, features: [FEATURES.ADS_OFF] });
      expect(zeroAd.CLIENT_HEADER_NAME).toEqual(CLIENT_HEADERS.HELLO.toLowerCase());
    });

    test("should parse client header data correctly with the official public key", () => {
      const zeroAd = ZeroAdNetwork({ siteId, features: [FEATURES.ADS_OFF] });
      const request = zeroAd.parseToken(validButExpiredClientHeaderValue);

      // expired token forces everything to be false
      expect(request).toEqual({
        ADS_OFF: false,
        COOKIE_CONSENT_OFF: false,
        MARKETING_DIALOG_OFF: false,
        CONTENT_PAYWALL_OFF: false,
        SUBSCRIPTION_ACCESS_ON: false,
      });
    });
  });
});
