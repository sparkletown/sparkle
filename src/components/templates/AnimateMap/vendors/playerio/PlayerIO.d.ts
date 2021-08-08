// @formatter:off
export type ErrorCallback = (PlayerIOError: Error) => void;
export type AuthenticateSuccessCallback = (client: client) => void;

export interface PlayerIO {
  // quickConnect;
  // useSecureApiRequests;
  authenticate(
    gameId: string,
    connectionId: string,
    authenticationArguments: object,
    playerInsightSegments: object,
    successCallback: AuthenticateSuccessCallback,
    errorCallback: ErrorCallback
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

export type ConnectionSuccessCallback = (connection: connection) => void;

export interface multiplayer {
  createJoinRoom(
    roomId: string,
    roomType: string,
    visible: boolean,
    roomData: object,
    joinData: object,
    successCallback: ConnectionSuccessCallback,
    errorCallback: ErrorCallback
  ): void;
}

export interface Double {
  _NumberBrand: "Double";
}

export interface Float {
  _NumberBrand: "Float";
}

export interface Int {
  _NumberBrand: "Int";
}

export interface UInt {
  _NumberBrand: "UInt";
}

export interface Long {
  _NumberBrand: "Long";
}

export interface ULong {
  _NumberBrand: "ULong";
}

export type ClearifyType<T> = T extends UInt
  ? number
  : T extends ULong
  ? number
  : T;

export type MemberOfTuple<T, N, U> = T[N] extends U ? ClearifyType<U> : never;

export interface Message<T> {
  addBoolean<N>(value: MemberOfTuple<T, N, boolean>): void;
  addString<N>(value: MemberOfTuple<T, N, string>): void;
  // addByteArray<N>(value: MemberOfTuple<T, N, number[]>) : void;
  addDouble<N>(value: MemberOfTuple<T, N, Double>): void;
  addFloat<N>(value: MemberOfTuple<T, N, Float>): void;
  addULong<N>(value: MemberOfTuple<T, N, ULong>): void;
  addLong<N>(value: MemberOfTuple<T, N, Long>): void;
  addUInt<N>(value: MemberOfTuple<T, N, UInt>): void;
  addInt<N>(value: MemberOfTuple<T, N, Int>): void;

  getBoolean<N extends number>(n: N): MemberOfTuple<T, N, boolean>;
  getString<N extends number>(n: N): MemberOfTuple<T, N, string>;
  // getByteArray<N extends number>(n:N) : MemberOfTuple<T,N,number[]>;
  getDouble<N extends number>(n: N): MemberOfTuple<T, N, Double>;
  getFloat<N extends number>(n: N): MemberOfTuple<T, N, Float>;
  getULong<N extends number>(n: N): MemberOfTuple<T, N, ULong>;
  getLong<N extends number>(n: N): MemberOfTuple<T, N, Long>;
  getUInt<N extends number>(n: N): MemberOfTuple<T, N, UInt>;
  getInt<N extends number>(n: N): MemberOfTuple<T, N, Int>;
}

export interface connection {
  connected: boolean;
  // addDisconnectCallback;
  addMessageCallback<T>(type: string, callback: (m: Message<T>) => void): void;
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

declare const playerIO: PlayerIO;
export default playerIO;
// @formatter:on
