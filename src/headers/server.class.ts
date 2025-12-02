import {
  CURRENT_PROTOCOL_VERSION,
  PROTOCOL_VERSION,
  SERVER_HEADERS,
  FEATURES,
  ServerHeaderOptions,
  UUID,
  WelcomeHeaderParseResult,
} from "../constants";
import {
  assert,
  base64ToUuid,
  getSiteFeaturesNative,
  hasFeature,
  isObject,
  setFeatures,
  uuidToBase64,
} from "../helpers";
import { log } from "../logger";

const SEPARATOR = "^";
const SITE_FEATURES_NATIVE = getSiteFeaturesNative();

export class ServerHeader {
  NAME = SERVER_HEADERS.WELCOME.toLowerCase();
  VALUE: string;

  constructor(options: ServerHeaderOptions) {
    if (typeof options === "string") {
      if (!options.length) {
        throw new Error("ServerHeader: non-empty welcome header string value must be provided");
      }

      this.VALUE = options;
    } else if (isObject(options) && "siteId" in options && "features" in options) {
      const { siteId, features } = options;

      if (typeof siteId !== "string" || !siteId.length || !Array.isArray(features) || !features.length) {
        throw new Error("ServerHeader options must be provided");
      }

      this.VALUE = this.encode(siteId, features);
    } else {
      throw new Error(
        "ServerHeader: non-empty welcome header string value or { siteId, features } options must be provided"
      );
    }
  }

  encode(siteId: UUID, features: FEATURES[]) {
    const flags = setFeatures(0, features);
    const encodedSiteId = uuidToBase64(siteId);

    return [encodedSiteId, CURRENT_PROTOCOL_VERSION, flags].join(SEPARATOR);
  }

  static decode(headerValue: string | undefined): WelcomeHeaderParseResult {
    if (!headerValue?.length) return;

    try {
      const parts = headerValue.split(SEPARATOR);
      assert(parts.length === 3, "Invalid header value format");

      const [encodedSiteId, protocolVersion, flags] = parts;
      assert(
        Object.values(PROTOCOL_VERSION).includes(Number(protocolVersion)),
        "Invalid or unsupported protocol version"
      );

      const siteId = base64ToUuid(encodedSiteId);
      assert(siteId.length === 36, "Invalid siteId value");

      assert(Number(flags).toFixed(0).toString() === flags, "Invalid flags number");

      let features: (keyof typeof FEATURES)[] = [];
      for (const [feature, shift] of SITE_FEATURES_NATIVE) {
        if (hasFeature(Number(flags), shift)) features.push(feature);
      }

      return {
        version: Number(protocolVersion),
        features,
        siteId,
      };
    } catch (err) {
      log("warn", "Could not decode server header value", { reason: (err as Error)?.message });
    }
  }
}
