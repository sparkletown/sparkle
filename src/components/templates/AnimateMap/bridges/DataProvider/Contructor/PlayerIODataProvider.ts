import { utils } from "pixi.js";

import PlayerIO, {
  client,
  connection,
} from "../../../vendors/playerio/PlayerIO";

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
          "bounce",
          true,
          {
            maxplayers: 750,
            name: "Burning Man",
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
    this.connection?.send(type, sessionId, Math.ceil(x), Math.ceil(y), id);
  }

  public savePlayerPosition() {}
}
