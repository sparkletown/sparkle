import { utils } from "pixi.js";

import { Point } from "types/utility";

import { getRandomInt } from "utils/getRandomInt";

import {
  ConnectionSuccessCallback,
  PlayerIOInstance,
} from "../../../../vendors/playerio/PlayerIO";
import { ProxyClient } from "../../../../vendors/playerio/PromissesWrappers/ProxyClient";
import { ProxyPlayerIO } from "../../../../vendors/playerio/PromissesWrappers/ProxyPlayerIO";
import EventProvider, { EventType } from "../../../EventProvider/EventProvider";
import playerModel from "../../Structures/PlayerModel";
import { RoomInfoType } from "../../Structures/RoomsModel";

import { getIntByHash } from "./utils/getIntByHash";
import { PlayerIORoomOperator } from "./PlayerIORoomOperator";
import {
  FindMessageTuple,
  MessagesTypes,
  PlayerObject,
  RoomTypes,
} from "./types";

export class PlayerIODataProvider extends utils.EventEmitter {
  private _PlayerIO = PlayerIOInstance;
  public PlayerIOWrapper = new ProxyPlayerIO(this._PlayerIO);
  public client?: ProxyClient;
  private isReserveTypeOfMove = false;

  private playerIORoomOperator?: PlayerIORoomOperator;
  private _playerObject?: PlayerObject;

  constructor(
    readonly playerioGameId: string,
    readonly playerId: string,
    private _connectionInitCallback: ConnectionSuccessCallback
  ) {
    super();
    this._init();
  }

  private _init() {
    this._initConnection()
      .then((client) => (this.client = client))
      .then(() => Promise.all([this._findRooms(), this._loadMyPlayerObject()]))
      .then(this._joinToRooms)
      .catch(this._reInit);
  }

  private async _initConnection() {
    if (this.client) return Promise.resolve(this.client);

    return this.PlayerIOWrapper.authenticate(this.playerioGameId, "public", {
      userId: this.playerId,
    });
  }

  private _findRooms = async () => {
    if (!this.client?.multiplayer)
      return Promise.reject("Connection not ready.");

    return this.client.multiplayer.listRooms<RoomInfoType>(
      RoomTypes.Zone,
      null,
      0,
      0
    );
  };

  private _loadMyPlayerObject = async () => {
    if (!this.client?.bigDB) return Promise.reject("Connection not ready.");
    return this.client.bigDB.loadMyPlayerObject();
  };

  private _reInit = (reason: Error | string) => {
    console.log(reason, "Init failure. Try again...");
    this._init();
  };

  private _joinToRooms = async (data: [RoomInfoType[], PlayerObject]) => {
    if (!this.client?.multiplayer)
      return Promise.reject("Connection not ready.");

    console.log(data);
    const rooms = data[0];
    // todo: доделать типизацию
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerObject: any = data[1].originDatabaseObject;
    let needSave = false;

    if (playerObject.x === undefined || playerObject.y === undefined) {
      needSave = true;
      // const pos = StartPoint();
      // playerObject.x = pos.x;
      // playerObject.y = pos.y;
      playerObject.x = getRandomInt(1440);
      playerObject.y = getRandomInt(1440);
      playerObject.i = getIntByHash(this.playerId);
    }

    if (needSave)
      await data[1]
        .save()
        .then(() => console.log("Save position"))
        .catch(console.error);

    // playerModel.x = playerObject.x;
    // playerModel.y = playerObject.y;
    playerModel.x = 500;
    playerModel.y = 500;

    EventProvider.emit(EventType.PLAYER_MODEL_READY, playerModel);

    if (!this.playerIORoomOperator) {
      console.log("init room operator");
      this.playerIORoomOperator = new PlayerIORoomOperator(
        this.client.multiplayer,
        { x: playerObject.x, y: playerObject.y },
        this.playerId
      );
    }
    this.playerIORoomOperator.position = {
      x: playerObject.x,
      y: playerObject.y,
    };
    this.playerIORoomOperator.update(rooms);

    return Promise.resolve(this.playerIORoomOperator);
  };

  // public async loadOrCreate(
  //   table: string,
  //   key: string,
  //   successCallback: (dbObj: dbObj) => void,
  //   errorCallback: (error: Error) => void
  // ) {
  //   if (this.client) {
  //     return new Promise((resolve, reject) => {
  //       this.client?.originClient.bigDB.loadOrCreate(
  //         table,
  //         key,
  //         (dbObj: dbObj) => {
  //           successCallback(dbObj);
  //           return resolve(dbObj);
  //         },
  //         (error: Error) => {
  //           errorCallback(error);
  //           return reject(error);
  //         }
  //       );
  //     });
  //   } else return Promise.reject("Can't load. PlayerIO client is undefined!");
  // }

  // public async load(
  //   table: string,
  //   key: string,
  //   successCallback: (dbObj: dbObj) => void,
  //   errorCallback: (error: Error) => void
  // ) {
  //   if (this.client) {
  //     return new Promise((resolve, reject) => {
  // this.client?.originClient.bigDB.loadOrCreate(
  //   table,
  //   key,
  //   (dbObj: dbObj) => {
  //     successCallback(dbObj);
  //     return resolve(dbObj);
  //   },
  //   (error: Error) => {
  //     errorCallback(error);
  //     return reject(error);
  //   }
  // );
  // });
  // } else return Promise.reject("Can't load. PlayerIO client is undefined!");
  // }

  public sendPlayerPosition(x: number, y: number) {
    if (!this.playerIORoomOperator?.mainConnection?.instance) {
      console.error("connection not exist");
      return;
    }

    const m = this.playerIORoomOperator.mainConnection.instance.createMessage<
      FindMessageTuple<MessagesTypes.move | MessagesTypes.moveReserve>
    >(
      this.isReserveTypeOfMove ? MessagesTypes.moveReserve : MessagesTypes.move
    );
    m.addUInt<0>(x);
    m.addUInt<1>(y);
    this.playerIORoomOperator.mainConnection.instance.sendMessage(m);
  }

  public savePlayerPosition(position: Point) {
    if (!this.playerIORoomOperator)
      return console.error("playerIORoomOperator not exist");
    this.playerIORoomOperator.position = position;
  }
}
