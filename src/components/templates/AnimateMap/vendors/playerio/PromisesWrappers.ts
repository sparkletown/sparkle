import { client, connection, Message, multiplayer, PlayerIO } from "./PlayerIO";

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
        (client) => {
          resolve(new ProxyClient(client));
        },
        (PlayerIOError) => {
          reject(PlayerIOError);
        }
      );
    });
  }
}

export class ProxyMultiplayer {
  constructor(public originMultiplayer: multiplayer) {}

  async createJoinRoom(
    roomId: string,
    roomType: string,
    visible: boolean,
    roomData: object,
    joinData: object = {}
  ) {
    return new Promise<ProxyConnection>((resolve, reject) => {
      this.originMultiplayer.createJoinRoom(
        roomId,
        roomType,
        visible,
        roomData,
        joinData,
        (connection) => resolve(new ProxyConnection(connection)),
        (PlayerIOError) => reject(PlayerIOError)
      );
    });
  }

  async listRooms<RoomInfo>(
    roomType: string,
    searchCriteria: object | null,
    resultLimit: number,
    resultOffset: number
  ) {
    return new Promise<RoomInfo[]>((resolve, reject) => {
      this.originMultiplayer.listRooms<RoomInfo>(
        roomType,
        searchCriteria,
        resultLimit,
        resultOffset,
        (roomInfo) => resolve(roomInfo),
        (error) => reject(error)
      );
    });
  }
}

export class ProxyClient {
  public multiplayer = new ProxyMultiplayer(this.originClient.multiplayer);

  constructor(public originClient: client) {}
}

export class ProxyConnection {
  constructor(public originConnection: connection) {}

  get connected() {
    return this.originConnection.connected;
  }

  public addMessageCallback<T>(
    type: string,
    callback: (m: Message<T>) => void
  ) {
    this.originConnection.addMessageCallback<T>(type, callback);
  }

  public disconnect() {
    this.originConnection.disconnect();
  }
}
