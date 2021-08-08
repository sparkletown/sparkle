import { client, PlayerIO } from "./PlayerIO";

export class PlayerIOPromisesWrapper {
  constructor(public PlayerIO: PlayerIO) {}

  async authenticate(
    gameId: string,
    connectionId: string,
    authenticationArguments: object,
    playerInsightSegments: object = {}
  ) {
    return new Promise<client>((resolve, reject) => {
      this.PlayerIO.authenticate(
        gameId,
        connectionId,
        authenticationArguments,
        playerInsightSegments,
        (client) => resolve(client),
        (PlayerIOError) => reject(PlayerIOError)
      );
    });
  }
}
