import { multiplayer } from "../PlayerIO";

import { ProxyConnection } from "./ProxyConnection";

export class ProxyMultiplayer {
  constructor(public originMultiplayer: multiplayer) {}

  async createJoinRoom(
    roomId: string,
    roomType: string,
    visible: boolean,
    roomData: object,
    joinData: object = {}
  ) {
    return new Promise<ProxyConnection>((resolve, reject) => {
      this.originMultiplayer.createJoinRoom(
        roomId,
        roomType,
        visible,
        roomData,
        joinData,
        (connection) => resolve(new ProxyConnection(connection)),
        reject
      );
    });
  }

  async listRooms<RoomInfo>(
    roomType: string,
    searchCriteria: object | null,
    resultLimit: number,
    resultOffset: number
  ) {
    return new Promise<RoomInfo[]>((resolve, reject) => {
      this.originMultiplayer.listRooms<RoomInfo>(
        roomType,
        searchCriteria,
        resultLimit,
        resultOffset,
        resolve,
        reject
      );
    });
  }
}
