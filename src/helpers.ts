import { FEATURES, UUID } from "./constants";

type SiteFeaturesNative = [keyof typeof FEATURES, FEATURES][];
let SITE_FEATURES_NATIVE: SiteFeaturesNative;

export const isObject = (value: unknown) => typeof value === "object" && value !== null && !Array.isArray(value);

export const getSiteFeaturesNative = (): SiteFeaturesNative => {
  if (SITE_FEATURES_NATIVE?.length) return SITE_FEATURES_NATIVE;

  return (SITE_FEATURES_NATIVE = Object.entries(FEATURES).filter(([key]) => isNaN(Number(key))) as SiteFeaturesNative);
};

export const toBase64 = (data: Uint8Array) => {
  if (typeof data.toBase64 === "function") return data.toBase64() as string;
  if (typeof Buffer !== "undefined") return Buffer.from(data).toString("base64") as string;

  if (typeof btoa === "function") {
    let binary = "";
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i]);
    }
    return btoa(binary);
  }

  throw new Error("Base64 encoding not supported in this environment");
};

export const fromBase64 = (input: string) => {
  if (typeof Uint8Array.fromBase64 === "function") return Uint8Array.fromBase64(input) as Uint8Array;
  if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(input, "base64"));

  if (typeof atob === "function") {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  throw new Error("Base64 decoding not supported in this environment");
};

export const uuidToBase64 = (uuid: UUID): string => {
  const hex = uuid.replace(/-/g, "");

  if (hex.length !== 32) throw new Error("Invalid UUID format");

  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }

  return toBase64(bytes).replace(/=+$/, "");
};

export const base64ToUuid = (input: string): string => {
  const bytes = fromBase64(input + "===".slice((input.length + 3) % 4));

  if (bytes.length !== 16) throw new Error("Invalid byte length for UUID");

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 8 + 4),
    hex.slice(12, 12 + 4),
    hex.slice(16, 16 + 4),
    hex.slice(20, 20 + 12),
  ].join("-");
};

export const assert = (value: unknown, message: string) => {
  if (!value) throw new Error(message);
};

export const hasFeature = (flags: number, feature: FEATURES) => Boolean(flags & feature);
export const clearFeature = (flags: number, feature: FEATURES) => (flags &= ~feature);
export const toggleFeature = (flags: number, feature: FEATURES) => (flags ^= feature);
export const setFeatures = (flags: number = 0, features: FEATURES[] = []) =>
  (flags |= features.reduce((acc, feature) => acc | feature, flags || 0));
