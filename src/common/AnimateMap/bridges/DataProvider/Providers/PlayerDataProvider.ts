import { AnimateMapPoint } from "common/AnimateMapCommon";

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

export class PlayerDataProvider implements PlayerDataProviderInterface {
  private _sendPosition: AnimateMapPoint = { x: 0, y: 0 };
  private _position = { x: 0, y: 0 };
  private _isReady = false;

  public isReady() {
    return this._isReady;
  }

  get position() {
    return { x: this._position.x, y: this._position.y };
  }

  constructor(readonly id: string, readonly commonInterface: CommonInterface) {}

  public updatePosition() {
    // AB = sqrt( (Ax-Bx)^2 + (Ay-By)^2 ) - distance between points
    const AxBx = this._sendPosition.x - this._position.x;
    const AyBy = this._sendPosition.y - this._position.y;
    const radicandExpression = AxBx * AxBx + AyBy * AyBy;
    if (radicandExpression > MAX_POSITION_DELTA_SQUARE) this.sendPosition();
  }

  // public async savePosition() {
  //   if (!this.id) return Promise.reject("Unexpected player id");
  //
  //   try {
  //     // this._playerObj?.save();
  //   } catch (error) {
  //     // console.log("PlayerDataProvider.savePosition: ", error);
  //   }
  // }

  public async sendPosition() {
    //TODO: send
    this.commonInterface.sendPlayerPosition(this._position.x, this._position.y);
    this._sendPosition.x = this._position.x;
    this._sendPosition.y = this._position.y;
    // this.savePosition();
  }

  // public async loadPosition(x: number, y: number) {
  //   if (!this.id) return Promise.reject("Unexpected player id");
  //   Promise.reject("Unexpected player id");
  // }

  public setPosition(x: number, y: number) {
    this._position.x = x;
    this._position.y = y;
    playerModel.x = x;
    playerModel.y = y;
  }

  // public async initPositionAsync(x: number, y: number) {
  //   if (this._isReady) return Promise.reject("Player already init!");
  //
  //   return this.loadPosition(x, y)
  //     .then(() => (this._isReady = true))
  //     .catch(() => {
  //       //Note: unreal case for player.io ?
  //       this.setPosition(x, y);
  //       this._isReady = true;
  //       return Promise.reject("Can't load position");
  //     });
  // }

  public release() {
    // this.savePosition().catch((error) => console.error(error));
  }
}
