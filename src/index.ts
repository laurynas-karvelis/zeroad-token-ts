import { ServerHeaderOptions, ZEROAD_NETWORK_PUBLIC_KEY } from "./constants";
import { ServerHeader } from "./headers/server.class";
import { ClientHeader } from "./headers/client.class";
import { setLogLevel } from "./logger";

export * from "./constants";
export type * from "./constants";
export { ServerHeader, ClientHeader, setLogLevel };

// Default export as a factory for convenient access
export function Site(options: ServerHeaderOptions) {
  const serverHeader = new ServerHeader(options);
  const clientHeader = new ClientHeader(ZEROAD_NETWORK_PUBLIC_KEY);

  return {
    setLogLevel,
    parseToken: clientHeader.parseToken.bind(clientHeader),
    CLIENT_HEADER_NAME: clientHeader.NAME,
    SERVER_HEADER_NAME: serverHeader.NAME,
    SERVER_HEADER_VALUE: serverHeader.VALUE,
  };
}
