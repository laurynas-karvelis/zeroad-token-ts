import { ServerHeader } from "./headers/server.class";
import { ClientHeader } from "./headers/client.class";
import { ServerHeaderOptions, ZEROAD_NETWORK_PUBLIC_KEY } from "./constants";
export { setLogLevel } from "./logger";

export * from "./constants";
export type * from "./constants";

export { ServerHeader, ClientHeader };

export class Site {
  serverHeader: ServerHeader;
  clientHeader: ClientHeader;

  constructor(options: ServerHeaderOptions) {
    this.serverHeader = new ServerHeader(options);
    this.clientHeader = new ClientHeader(ZEROAD_NETWORK_PUBLIC_KEY);
  }
}

let defaultSite: Site;

// Helpers for shorter syntax
export const init = (options: ServerHeaderOptions) => (defaultSite = new Site(options));
export const processRequest = (headerValue: string | undefined) => defaultSite.clientHeader.processRequest(headerValue);
export const getClientHeaderName = () => defaultSite.clientHeader.name;
export const getServerHeaderName = () => defaultSite.serverHeader.name;
export const getServerHeaderValue = () => defaultSite.serverHeader.value;
