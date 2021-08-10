import PlayerIO, {
  ConnectionSuccessCallback,
  Message,
  RoomInfo,
  UInt,
  ULong,
} from "../../../../vendors/playerio/PlayerIO";

import { utils } from "pixi.js";
import {
  ProxyClient,
  ProxyConnection,
  ProxyPlayerIO,
} from "../../../../vendors/playerio/PromisesWrappers";

export enum RoomTypes {
  Zone = "Z",
}

export enum MessagesTypes {
  move = "z",
}

export type MoveMessageTuple = [ULong, UInt, UInt, string];

const initialRoomData = {
  speaker: 1,
  a: 150,
  b: 150,
  c: 250,
  d: 250,
};
export type RoomDataType = typeof initialRoomData;
export type RoomInfoType = RoomInfo<RoomDataType, RoomTypes>;

export class PlayerIODataProvider<dbObj> extends utils.EventEmitter {
  public PlayerIOWrapper;
  private _PlayerIO = PlayerIO;
  public client: ProxyClient | undefined;
  public connection: ProxyConnection | undefined;

  constructor(
    readonly playerId: string,
    private _connectionInitCallback: ConnectionSuccessCallback
  ) {
    super();
    this.PlayerIOWrapper = new ProxyPlayerIO(this._PlayerIO);
    this.init();
  }

  public async init() {
    this._initConnection()
      .then((client) => (this.client = client))
      .then(() => {
        this.createRoom().then(() => {
          setTimeout(() => {
            this._findRooms()
              .then((rooms) => console.log(rooms))
              .catch((error) => console.error(error));
          }, 5000);
        });
      })
      .catch((error) => console.error(error));
  }

  private async _initConnection() {
    if (this.client) return Promise.resolve(this.client);

    return this.PlayerIOWrapper.authenticate(
      "bm-test-f30xkxglekvwxqoqgcw6w",
      "public",
      { userId: this.playerId }
    );
  }

  private async _findRooms() {
    return this.client?.multiplayer?.listRooms<RoomInfoType>(
      RoomTypes.Zone,
      null,
      0,
      0
    );
  }

  private async createRoom() {
    if (!this.client) return Promise.reject("Client not exist");

    // this.client.multiplayer.createJoinRoom("",
    // RoomTypes.Zone,
    //   true,
    //   initialRoomData)

    return this.client.multiplayer
      .createJoinRoom("test", RoomTypes.Zone, true, initialRoomData)
      .then((connection) => {
        this._connectionInitCallback(connection);
        this.connection = connection;
      });
    // .catch((error) => console.error("connection to room failure ", error));
  }

  public async loadOrCreate(
    table: string,
    key: string,
    successCallback: (dbObj: dbObj) => void,
    errorCallback: (error: Error) => void
  ) {
    if (this.client) {
      return new Promise((resolve, reject) => {
        this.client?.originClient.bigDB.loadOrCreate(
          table,
          key,
          (dbObj: dbObj) => {
            successCallback(dbObj);
            return resolve(dbObj);
          },
          (error: Error) => {
            errorCallback(error);
            return reject(error);
          }
        );
      });
    } else return Promise.reject("Can't load. PlayerIO client is undefined!");
  }

  public async load(
    table: string,
    key: string,
    successCallback: (dbObj: dbObj) => void,
    errorCallback: (error: Error) => void
  ) {
    if (this.client) {
      return new Promise((resolve, reject) => {
        this.client?.originClient.bigDB.loadOrCreate(
          table,
          key,
          (dbObj: dbObj) => {
            successCallback(dbObj);
            return resolve(dbObj);
          },
          (error: Error) => {
            errorCallback(error);
            return reject(error);
          }
        );
      });
    } else return Promise.reject("Can't load. PlayerIO client is undefined!");
  }

  public sendPlayerPosition(
    type: string,
    sessionId: number,
    x: number,
    y: number,
    id: string
  ) {
    if (!this.connection) {
      console.error("connection not exist");
      return;
    }
    //@ts-ignore
    const m: Message<MoveMessageTuple> = this.connection?.createMessage(type);
    m.addULong<0>(sessionId);
    m.addUInt<1>(x);
    m.addUInt<2>(y);
    m.addString<3>(id);
    //@ts-ignore
    this.connection?.sendMessage(m);
    // this.connection?.send(type, sessionId, Math.ceil(x), Math.ceil(y), id);
  }

  public savePlayerPosition() {}
}
