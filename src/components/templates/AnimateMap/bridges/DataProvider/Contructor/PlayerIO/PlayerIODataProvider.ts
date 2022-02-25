import { utils } from "pixi.js";

import { Point } from "types/utility";

import { getRandomInt } from "utils/getRandomInt";

import { PlaygroundMap } from "../../../../game/utils/PlaygroundMap";
import { PlayerIOInstance } from "../../../../vendors/playerio/PlayerIO";
import { ProxyClient } from "../../../../vendors/playerio/PromissesWrappers/ProxyClient";
import { ProxyMultiplayer } from "../../../../vendors/playerio/PromissesWrappers/ProxyMultiplayer";
import { ProxyPlayerIO } from "../../../../vendors/playerio/PromissesWrappers/ProxyPlayerIO";
import EventProvider, { EventType } from "../../../EventProvider/EventProvider";
import { CloudDataProvider } from "../../CloudDataProvider";
import playerModel from "../../Structures/PlayerModel";
import { RoomInfoType } from "../../Structures/RoomsModel";

import { IPlayerIORoomOperator } from "./RoomOperator/IPlayerIORoomOperator";
import { PlayerIORoomOperator } from "./RoomOperator/PlayerIORoomOperator";
import { PlayerIOSeparatedRoomOperator } from "./RoomOperator/PlayerIOSeparatedRoomOperator";
import { getIntByHash } from "./utils/getIntByHash";
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

  private playerIORoomOperator?: IPlayerIORoomOperator;
  private _playerObject?: PlayerObject;

  constructor(
    readonly cloudDataProvider: CloudDataProvider,
    readonly playerioGameId: string,
    readonly playerId: string,
    readonly reInitOnError: boolean = true
  ) {
    super();
    this._init();
  }

  private _init() {
    this._initConnection()
      .then((client) => (this.client = client))
      .then(() => Promise.all([this._findRooms(), this._loadMyPlayerObject()]))
      .then(this._joinToRooms)
      .catch(() => this.reInitOnError && this._reInit);
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
      this.cloudDataProvider.settings.playerioAdvancedMode
        ? RoomTypes.Zone
        : RoomTypes.SeparatedRoom,
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

    const rooms = data[0];
    this._playerObject = data[1].originDatabaseObject as PlayerObject;
    let needSave = false;

    if (
      this._playerObject.x === undefined ||
      this._playerObject.y === undefined
    ) {
      needSave = true;
      do {
        this._playerObject.x = getRandomInt(9920);
        this._playerObject.y = getRandomInt(9920);
        console.log(
          "CREATE USER in ",
          this._playerObject.x,
          this._playerObject.y
        );
      } while (
        !PlaygroundMap.pointIsOnThePlayground(
          this._playerObject.x,
          this._playerObject.y
        )
      );
      this._playerObject.i = getIntByHash(this.playerId);
    }

    if (needSave)
      await data[1]
        .save()
        .then(() => console.log("Save position"))
        .catch(console.error);

    playerModel.x = this._playerObject.x;
    playerModel.y = this._playerObject.y;

    EventProvider.emit(EventType.PLAYER_MODEL_READY, playerModel);

    this.playerIORoomOperator = this._getRoomOperator(this.client, playerModel);

    this.playerIORoomOperator.position = {
      x: this._playerObject.x,
      y: this._playerObject.y,
    };
    this.playerIORoomOperator.update(rooms);

    return Promise.resolve(this.playerIORoomOperator);
  };

  private _getRoomOperator(client: ProxyClient, playerPosition: Point) {
    if (this.playerIORoomOperator) return this.playerIORoomOperator;

    console.log(
      `init ${
        this.cloudDataProvider.settings.playerioAdvancedMode
          ? "ADVANCED"
          : "SEPARATED"
      } room operator`
    );
    const initialParams: [
      CloudDataProvider,
      ProxyMultiplayer,
      Point,
      string
    ] = [
      this.cloudDataProvider,
      client.multiplayer,
      { x: playerPosition.x, y: playerPosition.y },
      this.playerId,
    ];

    if (this.cloudDataProvider.settings.playerioAdvancedMode)
      return new PlayerIORoomOperator(...initialParams);
    else return new PlayerIOSeparatedRoomOperator(...initialParams);
  }

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

  public sendShoutMessage(shout: string) {
    if (!this.playerIORoomOperator?.mainConnection?.instance) {
      console.error("connection not exist");
      return;
    }

    const m = this.playerIORoomOperator.mainConnection.instance.createMessage<
      FindMessageTuple<MessagesTypes.shout | MessagesTypes.shoutReserve>
    >(
      this.isReserveTypeOfMove
        ? MessagesTypes.shoutReserve
        : MessagesTypes.shout
    );
    m.addString<0>(shout);
    this.playerIORoomOperator.mainConnection.instance.sendMessage(m);
  }

  public savePlayerPosition(position: Point) {
    if (!this.playerIORoomOperator)
      return console.error("playerIORoomOperator not exist");
    this.playerIORoomOperator.position = position;
  }
}
