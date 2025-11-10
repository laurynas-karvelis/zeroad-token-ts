import { describe, test, expect } from "bun:test";
import { ServerHeader } from "../headers/server.class";
import { SITE_FEATURES } from "../constants";

describe("ServerHeader class", () => {
  const siteId = "6418723C-9D55-4B95-B9CE-BC4DBDFFC812";
  const features = [SITE_FEATURES.ADLESS_EXPERIENCE, SITE_FEATURES.PREMIUM_CONTENT_ACCESS];

  test("should generate a valid welcome header", () => {
    const header = new ServerHeader(siteId, features);
    expect(header.value).toEqual("ZBhyPJ1VS5W5zrxNvf/IEg^1^3");
  });

  test("should parse a valid welcome header", () => {
    const header = new ServerHeader(siteId, features);
    expect(header.decode("ZBhyPJ1VS5W5zrxNvf/IEg^1^3")).toEqual({
      version: 1,
      flags: 3,
      siteId: siteId.toLocaleLowerCase(),
    });
  });

  test("should parse as null on an invalid header value", () => {
    const header = new ServerHeader(siteId, features);

    expect(header.decode("")).toBeUndefined();
    expect(header.decode(null as any)).toBeUndefined();
    expect(header.decode(undefined as any)).toBeUndefined();
    expect(header.decode("1^1")).toBeUndefined();

    expect(header.decode("ZBhyPJ1VS5W5zrxNvf/IE^1^1")).toBeUndefined();
    expect(header.decode("ZBhyPJ1VS5W5zrxNvf/IEg^1^8")).toBeUndefined();
    expect(header.decode("ZBhyPJ1VS5W5zrxNvf/IEg^0^1")).toBeUndefined();
    expect(header.decode("ZBhyPJ1VS5W5zrxNvf/IEg^1^1.1")).toBeUndefined();
    expect(header.decode("ZBhyPJ1VS5W5zrxNvf/IEg^1.1^1")).toBeUndefined();
  });
});
