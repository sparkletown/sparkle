/* eslint-disable */
export interface PlayerIO {
  // quickConnect;
  // useSecureApiRequests;
  authenticate(
    gameId: string,
    connectionId: string,
    authenticationArguments: object,
    playerInsightSegments: object,
    successCallback: (client: client) => void,
    errorCallback: (PlayerIOError: Error) => void
  ): void;

  // gameFS;
}

export interface client {
  // achievements;
  bigDB: bigDB;
  // connectUserId;
  // errorLog;
  // gameFS;
  // gameId;
  // gameRequests;
  // leaderboards;
  multiplayer: multiplayer;
  // notifications;
  // oneScore;
  // payVault;
  // playerInsight;
  // publishingNetwork;
}

export interface multiplayer {
  createJoinRoom(
    roomId: string,
    roomType: string,
    visible: boolean,
    roomData: object,
    joinData: object,
    successCallback: (connection: connection) => void,
    errorCallback: (PlayerIOError: Error) => void
  ): void;
}

export interface connection {
  connected: boolean;

  // addDisconnectCallback;
  addMessageCallback(
    type: string,
    callback: (type: string, ...args: any) => void
  ): void;

  // createMessage;
  disconnect(): void;

  // removeDisconnectCallback;
  // removeMessageCallback;
  send(type: string, ...args): void;

  // sendMessage;
}

export interface dbObj {
  save(): void;
}

export interface bigDB {
  createObject;
  deleteKeys;
  deleteRange;
  load;
  loadKeys;

  loadKeysOrCreate<T>(
    table: string,
    key: string,
    successCallback: (dbObj: T) => void,
    errorCallback: (error: Error) => {}
  ): void;

  loadMyPlayerObject;
  loadOrCreate;
  loadRange;
  loadSingle;
  saveChanges;
}

export const PlayerIOInstance: PlayerIO;
/* eslint-enable */
