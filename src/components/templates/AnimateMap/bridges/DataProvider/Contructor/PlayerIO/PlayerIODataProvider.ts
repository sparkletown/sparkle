import PlayerIO, {
  client,
  connection,
} from "../../../../vendors/playerio/PlayerIO";

import { utils } from "pixi.js";

export enum RoomTypes {
  Zone = "Z",
}

export enum MessagesTypes {
  move = "z",
}

export class PlayerIODataProvider<dbObj> extends utils.EventEmitter {
  private _PlayerIO;
  public client: client | undefined;
  public connection: connection | undefined;

  constructor(
    readonly playerId: string,
    connectionInitCallback: (connection: connection) => void
  ) {
    super();

    //TODO: do connect once
    this._PlayerIO = PlayerIO;
    this._PlayerIO.authenticate(
      "bm-test-f30xkxglekvwxqoqgcw6w",
      "public",
      { userId: playerId },
      {}, //@ts-ignore
      (client) => {
        this.client = client;
        console.log("Connect success");
        console.log(this._PlayerIO);
        //TODO: create/load user position
        //TODO: calculate area position
        //TODO: join to 9 rooms
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
            connectionInitCallback(connection);
            this.connection = connection;
          },
          (error) => {
            console.log("connection to room failure");
            //TODO: create room?
          }
        );

        setTimeout(() => {
          //@ts-ignore
          client.multiplayer.listRooms(
            RoomTypes.Zone,
            null,
            0,
            0,
            (roomInfo: object[]) => {
              console.log("SUCCESS");
              console.log(roomInfo);
            }, //@ts-ignore
            (error) => {
              console.log("FAIL");
              console.error(error);
            }
          );
        }, 5000);
      }, //@ts-ignore
      (error) => {
        console.log("Connect failure");
        console.log(error);
      }
    );
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
    const m = this.connection?.createMessage(type);
    //@ts-ignore
    m.addULong(sessionId);
    //@ts-ignore
    m.addUInt(x);
    //@ts-ignore
    m.addUInt(y);
    //@ts-ignore
    m.addString(id);
    //@ts-ignore
    this.connection?.sendMessage(m);
    // this.connection?.send(type, sessionId, Math.ceil(x), Math.ceil(y), id);
  }

  public savePlayerPosition() {}
}
