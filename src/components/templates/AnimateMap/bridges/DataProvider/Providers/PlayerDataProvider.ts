import { Point } from "../../../game/utils/Point";
import { dbObj } from "../../../vendors/playerio/PlayerIO";
import { PlayerDataProviderInterface } from "../../DataProvider";
import { CommonInterface } from "../Contructor/CommonInterface";
import playerModel from "../Structures/PlayerModel";

export enum MessageType {
  move = "move",
}

const MAX_POSITION_DELTA = 50; //max distance when we need send new position to firestore
const MAX_POSITION_DELTA_SQUARE = Math.pow(MAX_POSITION_DELTA, 2); //optimization for calc
export const MAX_BASE_POINT_DELTA = 500; //max distance when we need send new position to firestore
export const USERS_POSITION_COLLECTION = "usersPosition";

export enum PlayerDataProviderEvents {
  BASE_POINT_CHANGED = "BASE_POINT_CHANGED",
}

export interface dbPlayer extends dbObj {
  x: number;
  y: number;
}

export interface idObject extends dbObj {
  id: string;
}

export class PlayerDataProvider
  // extends PlayerIOProvider<dbPlayer>
  implements PlayerDataProviderInterface {
  private _sendPosition: Point = { x: 0, y: 0 };
  private _playerObj: dbPlayer = { x: 0, y: 0 } as dbPlayer;
  private _isReady = false;
  public sessionId: number | null = null;

  public isReady() {
    return this._isReady;
  }

  get position() {
    return { x: this._playerObj.x, y: this._playerObj.y };
  }

  constructor(readonly id: string, readonly commonInterface: CommonInterface) {}

  public updatePosition() {
    // AB = sqrt( (Ax-Bx)^2 + (Ay-By)^2 ) - distance between points
    const AxBx = this._sendPosition.x - this._playerObj.x;
    const AyBy = this._sendPosition.y - this._playerObj.y;
    const radicandExpression = AxBx * AxBx + AyBy * AyBy;
    if (radicandExpression > MAX_POSITION_DELTA_SQUARE) this.sendPosition();
  }

  public async savePosition() {
    if (!this.id) return Promise.reject("Unexpected player id");

    try {
      this._playerObj?.save();
    } catch (error) {
      console.log("PlayerDataProvider.savePosition: ", error);
    }
  }

  public async sendPosition() {
    //TODO: send
    if (this.sessionId)
      this.commonInterface.sendPlayerPosition(
        this.sessionId,
        this._playerObj.x,
        this._playerObj.y,
        this.id
      );
    this._sendPosition.x = this._playerObj.x;
    this._sendPosition.y = this._playerObj.y;
    this.savePosition();
  }

  public async loadPosition(x: number, y: number) {
    if (!this.id) return Promise.reject("Unexpected player id");

    const successCallback = (playerObj: dbPlayer) => {
      console.log("success callback");
      if (!playerObj.x || !playerObj.y) {
        playerObj.x = x;
        playerObj.y = y;
        playerObj.save();
      }
      this._playerObj = playerObj;
    };
    const errorCallback = (error: Error) => {
      console.error(error);
    };

    return this.commonInterface //todo: wrap callback to promise
      .loadPlayerPositionAsync(this.id, successCallback, errorCallback)
      .then(() => {});
  }

  public setPosition(x: number, y: number) {
    this._playerObj.x = x;
    this._playerObj.y = y;
    playerModel.x = x;
    playerModel.y = y;
  }

  public async initPositionAsync(x: number, y: number) {
    if (this._isReady) return Promise.reject("Player already init!");

    return this.loadPosition(x, y)
      .then(() => (this._isReady = true))
      .catch(() => {
        //Note: unreal case for player.io ?
        this.setPosition(x, y);
        this._isReady = true;
        return Promise.reject("Can't load position");
      });
  }

  public release() {
    this.savePosition().catch((error) => console.error(error));
  }
}
