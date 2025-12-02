/**
 * This is an official ZeroAd Network public key.
 * Used to verify `X-Better-Web-User` header values are not tampered with.
 */
export const ZEROAD_NETWORK_PUBLIC_KEY: string = "MCowBQYDK2VwAyEAignXRaTQtxEDl4ThULucKNQKEEO2Lo5bEO8qKwjSDVs=";

export enum FEATURES {
  /** Render no advertisements anywhere on the page */
  ADS_OFF = 1 << 0,
  /** Render no Cookie Consent screens (headers, footers or dialogs) on the page with complete OPT-OUT for non-functional trackers */
  COOKIE_CONSENT_OFF = 1 << 1,
  /** Render no marketing dialogs or popups such as newsletter, promotion etc. on the page */
  MARKETING_DIALOG_OFF = 1 << 2,
  /** Provide automatic access to otherwise paywalled content such as articles, news etc. */
  CONTENT_PAYWALL_OFF = 1 << 3,
  /** Provide automatic access to site features provided behind a SaaS at least the basic subscription plan */
  SUBSCRIPTION_ACCESS_ON = 1 << 4,
}

export type UUID = string;

export enum SERVER_HEADERS {
  WELCOME = "X-Better-Web-Welcome",
}

export enum CLIENT_HEADERS {
  HELLO = "X-Better-Web-Hello",
}

export enum PROTOCOL_VERSION {
  V_1 = 1,
}

export const CURRENT_PROTOCOL_VERSION = PROTOCOL_VERSION.V_1;

export type ServerHeaderExtendedOptions = {
  siteId: UUID;
  features: FEATURES[];
};

export type ServerHeaderOptions = NonNullable<string | ServerHeaderExtendedOptions>;

export type WelcomeHeaderParseResult = WelcomeHeader | undefined;
export type WelcomeHeader = {
  version: PROTOCOL_VERSION;
  features: (keyof typeof FEATURES)[];
  siteId: UUID;
};

export type ClientHeaderParseResult = ClientParsedHeader | undefined;
export type ClientParsedHeader = {
  version: PROTOCOL_VERSION;
  expiresAt: Date;
  flags: number;
};
