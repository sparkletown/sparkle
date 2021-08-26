import { Point } from "types/utility";

import { ProxyConnection } from "../../../../vendors/playerio/PromissesWrappers/ProxyConnection";
import { ProxyMultiplayer } from "../../../../vendors/playerio/PromissesWrappers/ProxyMultiplayer";
import EventProvider, { EventType } from "../../../EventProvider/EventProvider";
import { initialRoomData } from "../../Structures/RoomsModel";

import { NinePartRoomOperator } from "./RoomLogic/NinePartRoomOperator";
import { getIntByHash } from "./utils/getIntByHash";
import { FindMessageTuple, MessagesTypes, RoomTypes } from "./types";

export interface ConnectionWrapper {
  id?: string;
  instance?: ProxyConnection;
}

/**
 * Main logic class for working with rooms
 */
export class PlayerIORoomOperator extends NinePartRoomOperator {
  public mainConnection: ConnectionWrapper = {};
  public peripheralConnections: ConnectionWrapper[] = [];

  public constructor(
    public multiplayer: ProxyMultiplayer,
    playerPosition: Point,
    public playerId: string
  ) {
    super(playerPosition);
  }

  public onCreate(id: string, isMain: boolean = false) {
    console.log(this);
    this.multiplayer
      .createJoinRoom(id, RoomTypes.Zone, true, initialRoomData, {
        isMain: isMain,
      })
      .then((connection) => {
        if (isMain) {
          console.log(`Connect to ${id} as main`);
          this.mainConnection.id = id;
          this.mainConnection.instance = connection;
        } else {
          console.log(`Connect to ${id} as peripheral`);
          this.peripheralConnections.push({
            id: id,
            instance: connection,
          });
        }

        connection.addMessageCallback<
          FindMessageTuple<MessagesTypes.newUserJoined>
        >(MessagesTypes.newUserJoined, (m) => {
          const userId = m.getString(0);
          const x = m.getUInt(1);
          const y = m.getUInt(2);
          console.log(`User ${userId} joint to ${id} on position (${x},${y})`);
          if (getIntByHash(this.playerId).toString() !== userId)
            EventProvider.emit(EventType.USER_JOINED, Number(userId), x, y);
        });

        connection.addMessageCallback<
          FindMessageTuple<MessagesTypes.processedMove>
        >(MessagesTypes.processedMove, (m) => {
          const innerUserId = m.getULong(0);
          const x = m.getUInt(1);
          const y = m.getUInt(2);
          // console.log("moved");
          // console.log(innerUserId, x, y);
          if (getIntByHash(this.playerId) !== innerUserId)
            EventProvider.emit(EventType.USER_MOVED, innerUserId, x, y);
        });

        connection.addMessageCallback<
          FindMessageTuple<MessagesTypes.processedMoveReserve>
        >(MessagesTypes.processedMoveReserve, (m) => {
          const innerUserId = m.getString(0);
          const x = m.getUInt(1);
          const y = m.getUInt(2);
          // console.log("moved reserve");
          // console.log(innerUserId, x, y);
          if (getIntByHash(this.playerId).toString() !== innerUserId)
            EventProvider.emit(EventType.USER_MOVED, Number(innerUserId), x, y);
        });

        connection.addMessageCallback<FindMessageTuple<MessagesTypes.userLeft>>(
          MessagesTypes.userLeft,
          (m) => {
            const innerUserId = m.getString(0);
            console.log(`User ${innerUserId} left from ${id}`);
            if (getIntByHash(this.playerId).toString() !== innerUserId)
              EventProvider.emit(EventType.USER_LEFT, Number(innerUserId));
          }
        );

        connection.addMessageCallback<
          FindMessageTuple<MessagesTypes.divideSpeakers>
        >(MessagesTypes.divideSpeakers, (m) => {
          console.log("DIVIDE!");
          //TODO: check removeMessageCallback needed or not
          this._divideHandler(id);
        });
      });
  }

  public async onJoin(id: string) {
    return this.multiplayer
      .createJoinRoom(id, RoomTypes.Zone, true, initialRoomData)
      .then((connection) => {
        console.log("sss Room created");
        // this._connectionInitCallback(connection);
        // this.connection = connection;
      });
  }

  public async onLeave(id: string) {
    if (this.mainConnection.id === id) {
      this.mainConnection.instance?.disconnect();
      this.mainConnection.instance = undefined;
    }
  }
}
