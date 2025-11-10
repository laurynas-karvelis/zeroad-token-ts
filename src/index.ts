import * as constants from "./constants";
import { ServerHeader } from "./headers/server.class";
import { ClientHeader } from "./headers/client.class";
export { setLogLevel } from "./logger";

export { ServerHeader, ClientHeader, constants };

export type SiteOptions = {
  siteId: constants.UUID;
  features: constants.SITE_FEATURES[];
};

export class Site {
  serverHeader: ServerHeader;
  clientHeader: ClientHeader;

  constructor({ siteId, features }: SiteOptions) {
    this.serverHeader = new ServerHeader(siteId, features);
    this.clientHeader = new ClientHeader(constants.ZEROAD_NETWORK_PUBLIC_KEY);
  }
}

let _defaultSite: Site;

// Helpers for shorter syntax
export const init = (options: SiteOptions) => (_defaultSite = new Site(options));
export const processRequest = (headerValue: string | undefined) =>
  _defaultSite.clientHeader.processRequest(headerValue);
export const getClientHeaderName = () => _defaultSite.clientHeader.name;
export const getServerHeaderName = () => _defaultSite.serverHeader.name;
export const getServerHeaderValue = () => _defaultSite.serverHeader.value;
