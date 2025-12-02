import { describe, test, expect } from "bun:test";
import { ServerHeader } from "../headers/server.class";
import { FEATURES } from "../constants";

describe("ServerHeader class", () => {
  const siteId = "6418723C-9D55-4B95-B9CE-BC4DBDFFC812";

  describe("constructor", () => {
    test("should throw on constructor param being undefined", () => {
      expect(() => new ServerHeader(undefined as unknown as any)).toThrow(
        /non-empty welcome header string value or { siteId, features } options must be provided/
      );
    });

    test("should throw on constructor param being null", () => {
      expect(() => new ServerHeader(null as unknown as any)).toThrow(
        /non-empty welcome header string value or { siteId, features } options must be provided/
      );
    });

    test("should throw on constructor param being an empty string", () => {
      expect(() => new ServerHeader("")).toThrow(/non-empty welcome header string value must be provided/);
    });

    test("should throw on constructor param as object is missing 'siteId'", () => {
      expect(() => new ServerHeader({ features: [FEATURES.ADS_OFF] } as any)).toThrow(
        /non-empty welcome header string value or { siteId, features } options must be provided/
      );
    });

    test("should throw on constructor param as object 'siteId' is empty string", () => {
      expect(() => new ServerHeader({ siteId: "", features: [FEATURES.ADS_OFF] })).toThrow(/options must be provided/);
    });

    test("should throw on constructor param as object 'features' is not provided", () => {
      expect(() => new ServerHeader({ siteId: "D2DB2B29-FCE0-42CC-9C8F-ED0BC99A2EF7" } as any)).toThrow(
        /options must be provided/
      );
    });

    test("should throw on constructor param as object 'features' is not an array", () => {
      expect(
        () => new ServerHeader({ siteId: "D2DB2B29-FCE0-42CC-9C8F-ED0BC99A2EF7", features: "not-array" } as any)
      ).toThrow(/options must be provided/);
    });

    test("should throw on constructor param as object 'features' array is empty", () => {
      expect(() => new ServerHeader({ siteId: "D2DB2B29-FCE0-42CC-9C8F-ED0BC99A2EF7", features: [] })).toThrow(
        /options must be provided/
      );
    });

    test('should initialize object by providing "Welcome Header" value only', () => {
      const header = new ServerHeader("ZBhyPJ1VS5W5zrxNvf/IEg^1^3");
      expect(header.VALUE).toEqual("ZBhyPJ1VS5W5zrxNvf/IEg^1^3");
    });

    test("should generate a valid welcome header when {siteId, features} are provided", () => {
      const features = [FEATURES.ADS_OFF, FEATURES.SUBSCRIPTION_ACCESS_ON];
      const header = new ServerHeader({ siteId, features });
      expect(header.VALUE).toEqual("ZBhyPJ1VS5W5zrxNvf/IEg^1^17");
    });
  });

  describe("decode()", () => {
    test("should parse a valid welcome header", () => {
      expect(ServerHeader.decode("ZBhyPJ1VS5W5zrxNvf/IEg^1^3")).toEqual({
        features: ["ADS_OFF", "COOKIE_CONSENT_OFF"],
        siteId: siteId.toLocaleLowerCase(),
        version: 1,
      });
    });

    test("should parse as undefined on an invalid header value", () => {
      expect(ServerHeader.decode("")).toBeUndefined();
      expect(ServerHeader.decode(null as never)).toBeUndefined();
      expect(ServerHeader.decode(undefined as never)).toBeUndefined();
      expect(ServerHeader.decode("1^1")).toBeUndefined();

      expect(ServerHeader.decode("ZBhyPJ1VS5W5zrx/IE^1^1")).toBeUndefined();
      expect(ServerHeader.decode("ZBhyPJ1VS5W5zrxNvf/IE^1^1")).toBeUndefined();
      expect(ServerHeader.decode("ZBhyPJ1VS5W5zrxNvf/IEg^1")).toBeUndefined();
      expect(ServerHeader.decode("ZBhyPJ1VS5W5zrxNvf/IEg^0^1")).toBeUndefined();
      expect(ServerHeader.decode("ZBhyPJ1VS5W5zrxNvf/IEg^1^1.1")).toBeUndefined();
      expect(ServerHeader.decode("ZBhyPJ1VS5W5zrxNvf/IEg^1.1^1")).toBeUndefined();
    });
  });
});
