import { PlayerIO } from "../PlayerIO";

import { ProxyClient } from "./ProxyClient";

export class ProxyPlayerIO {
  constructor(public originPlayerIO: PlayerIO) {}

  async authenticate(
    gameId: string,
    connectionId: string,
    authenticationArguments: object,
    playerInsightSegments: object = {}
  ) {
    return new Promise<ProxyClient>((resolve, reject) => {
      this.originPlayerIO.authenticate(
        gameId,
        connectionId,
        authenticationArguments,
        playerInsightSegments,
        (client) => resolve(new ProxyClient(client)),
        reject
      );
    });
  }
}
