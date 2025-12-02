import { describe, test, expect } from "bun:test";
import { generateKeys } from "../native.crypto";
import { ClientHeader } from "../headers/client.class";
import { CURRENT_PROTOCOL_VERSION, FEATURES, ZEROAD_NETWORK_PUBLIC_KEY } from "../constants";

describe("ClientHeader class", () => {
  describe("decode()", () => {
    test("should generate a valid header value", () => {
      const { publicKey, privateKey } = generateKeys();
      const header = new ClientHeader(publicKey, privateKey);

      const expiresAt = new Date(Date.now() + 24 * 3600 * 1000);
      const features = [FEATURES.ADS_OFF, FEATURES.COOKIE_CONSENT_OFF, FEATURES.MARKETING_DIALOG_OFF];

      const headerValue = header.encode(CURRENT_PROTOCOL_VERSION, expiresAt, features);

      expect(typeof headerValue).toBe("string");

      expect(header.decode(headerValue)).toEqual({
        expiresAt: new Date(Math.floor(expiresAt.getTime() / 1000) * 1000),
        version: CURRENT_PROTOCOL_VERSION,
        flags: 7,
      });

      expect(header.parseToken(headerValue)).toEqual({
        ADS_OFF: true,
        COOKIE_CONSENT_OFF: true,
        MARKETING_DIALOG_OFF: true,
        CONTENT_PAYWALL_OFF: false,
        SUBSCRIPTION_ACCESS_ON: false,
      });
    });

    test("should generate a valid header value with expired token", () => {
      const { publicKey, privateKey } = generateKeys();
      const header = new ClientHeader(publicKey, privateKey);

      const expiresAt = new Date(Date.now() - 24 * 3600 * 1000);
      const features = [FEATURES.ADS_OFF, FEATURES.COOKIE_CONSENT_OFF, FEATURES.MARKETING_DIALOG_OFF];

      const headerValue = header.encode(CURRENT_PROTOCOL_VERSION, expiresAt, features);

      expect(typeof headerValue).toBe("string");

      expect(header.decode(headerValue)).toEqual({
        expiresAt: new Date(Math.floor(expiresAt.getTime() / 1000) * 1000),
        version: CURRENT_PROTOCOL_VERSION,
        flags: 7,
      });

      expect(header.parseToken(headerValue)).toEqual({
        ADS_OFF: false,
        COOKIE_CONSENT_OFF: false,
        MARKETING_DIALOG_OFF: false,
        CONTENT_PAYWALL_OFF: false,
        SUBSCRIPTION_ACCESS_ON: false,
      });
    });

    test("should parse as undefined on a forged header value", () => {
      const { privateKey } = generateKeys();
      const header = new ClientHeader(ZEROAD_NETWORK_PUBLIC_KEY, privateKey);

      const expiresAt = new Date(Date.now() - 24 * 3600 * 1000);
      const features = [FEATURES.ADS_OFF, FEATURES.COOKIE_CONSENT_OFF, FEATURES.MARKETING_DIALOG_OFF];

      const headerValue = header.encode(CURRENT_PROTOCOL_VERSION, expiresAt, features);

      expect(typeof headerValue).toBe("string");
      expect(header.decode(headerValue)).toBeUndefined();

      expect(header.parseToken(headerValue)).toEqual({
        ADS_OFF: false,
        COOKIE_CONSENT_OFF: false,
        MARKETING_DIALOG_OFF: false,
        CONTENT_PAYWALL_OFF: false,
        SUBSCRIPTION_ACCESS_ON: false,
      });
    });

    test("should not throw on undefined param", () => {
      const header = new ClientHeader(ZEROAD_NETWORK_PUBLIC_KEY);
      expect(header.decode(undefined as unknown as any)).toBeUndefined();
    });
  });

  describe("parseToken()", () => {
    test("should not throw if array of strings is provided", () => {
      const header = new ClientHeader(ZEROAD_NETWORK_PUBLIC_KEY);
      expect(header.parseToken(["some-value", "another-value"])).toEqual({
        ADS_OFF: false,
        COOKIE_CONSENT_OFF: false,
        MARKETING_DIALOG_OFF: false,
        CONTENT_PAYWALL_OFF: false,
        SUBSCRIPTION_ACCESS_ON: false,
      });
    });

    test("should not throw if an empty array is provided", () => {
      const header = new ClientHeader(ZEROAD_NETWORK_PUBLIC_KEY);
      expect(header.parseToken([])).toEqual({
        ADS_OFF: false,
        COOKIE_CONSENT_OFF: false,
        MARKETING_DIALOG_OFF: false,
        CONTENT_PAYWALL_OFF: false,
        SUBSCRIPTION_ACCESS_ON: false,
      });
    });

    test("should not throw if an undefined param is provided", () => {
      const header = new ClientHeader(ZEROAD_NETWORK_PUBLIC_KEY);
      expect(header.parseToken(undefined)).toEqual({
        ADS_OFF: false,
        COOKIE_CONSENT_OFF: false,
        MARKETING_DIALOG_OFF: false,
        CONTENT_PAYWALL_OFF: false,
        SUBSCRIPTION_ACCESS_ON: false,
      });
    });
  });
});
