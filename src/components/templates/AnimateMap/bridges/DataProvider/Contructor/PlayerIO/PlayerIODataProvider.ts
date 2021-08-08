import PlayerIO, {
  client,
  connection,
  ConnectionSuccessCallback,
  Message,
  UInt,
  ULong,
} from "../../../../vendors/playerio/PlayerIO";

import { utils } from "pixi.js";
import { PlayerIOPromisesWrapper } from "../../../../vendors/playerio/PlayerIOPromisesWrapper";

export enum RoomTypes {
  Zone = "Z",
}

export enum MessagesTypes {
  move = "z",
}

export type MoveMessageTuple = [ULong, UInt, UInt, string];

export class PlayerIODataProvider<dbObj> extends utils.EventEmitter {
  public PlayerIOWrapper;
  private _PlayerIO = PlayerIO;
  public client: client | undefined;
  public connection: connection | undefined;

  constructor(
    readonly playerId: string,
    private _connectionInitCallback: ConnectionSuccessCallback
  ) {
    super();
    this.PlayerIOWrapper = new PlayerIOPromisesWrapper(this._PlayerIO);
    this.initConnection();
  }

  public initConnection() {
    if (this.connection?.connected) return;

    this.PlayerIOWrapper.authenticate(
      "bm-test-f30xkxglekvwxqoqgcw6w",
      "public",
      { userId: this.playerId }
    )
      .then((client: client) => this._successConnectionHandler(client))
      .catch((error) => console.error(error));
  }

  private _successConnectionHandler(client: client) {
    this.client = client;
    console.log("Connect success");
    client.multiplayer.createJoinRoom(
      "test",
      RoomTypes.Zone,
      true,
      {
        speaker: 1,
        a: 150,
        b: 150,
        c: 250,
        d: 250,
      },
      {},
      (connection) => {
        console.log("connection to room success");
        this._connectionInitCallback(connection);
        this.connection = connection;
      },
      (error) => {
        console.log("connection to room failure");
        //TODO: create room?
      }
    );

    // setTimeout(() => {
    //   //@ts-ignore
    //   client.multiplayer.listRooms(
    //     RoomTypes.Zone,
    //     null,
    //     0,
    //     0,
    //     (roomInfo: object[]) => {
    //       console.log("SUCCESS");
    //       console.log(roomInfo);
    //     }, //@ts-ignore
    //     (error) => {
    //       console.log("FAIL");
    //       console.error(error);
    //     }
    //   );
    // }, 5000);
  }

  public async loadOrCreate(
    table: string,
    key: string,
    successCallback: (dbObj: dbObj) => void,
    errorCallback: (error: Error) => void
  ) {
    if (this.client) {
      return new Promise((resolve, reject) => {
        this.client?.bigDB.loadOrCreate(
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
        this.client?.bigDB.loadOrCreate(
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
