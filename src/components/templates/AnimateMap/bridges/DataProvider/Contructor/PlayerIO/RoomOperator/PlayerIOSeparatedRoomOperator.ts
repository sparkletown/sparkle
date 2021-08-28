import { Point } from "types/utility";

import { ProxyMultiplayer } from "../../../../../vendors/playerio/PromissesWrappers/ProxyMultiplayer";
import EventProvider, {
  EventType,
} from "../../../../EventProvider/EventProvider";
import { initialRoomData, RoomInfoType } from "../../../Structures/RoomsModel";
import { FindMessageTuple, MessagesTypes, RoomTypes } from "../types";
import { getIntByHash } from "../utils/getIntByHash";

import { IPlayerIORoomOperator } from "./IPlayerIORoomOperator";
import { ConnectionWrapper } from "./PlayerIORoomOperator";

enum IsConnectedStates {
  false = 0,
  true,
  inProgress,
}

const MAX_USERS = 80;

export class PlayerIOSeparatedRoomOperator implements IPlayerIORoomOperator {
  mainConnection: ConnectionWrapper = {};
  position: Point;

  public constructor(
    public multiplayer: ProxyMultiplayer,
    playerPosition: Point,
    public playerId: string
  ) {
    this.position = playerPosition;
  }

  private isConnected: IsConnectedStates = IsConnectedStates.false;

  update(listRooms: RoomInfoType[], hardUpdate?: boolean): void {
    if (this.position.x < 0 || this.position.y < 0) return; //todo: add checking with bounds ?
    if (this.isConnected) return;

    this.isConnected = IsConnectedStates.inProgress;
    console.log("UPDATE ROOM...");
    const id = listRooms
      .filter((room) => room.onlineUsers < MAX_USERS)
      .sort((a, b) => b.onlineUsers - a.onlineUsers)[0]?.id;
    this.onCreate(id)
      .then(() => {
        console.log("SUCCESS CONNECT");
        this.isConnected = IsConnectedStates.true;
      })
      .catch(() => {
        console.warn("FAILURE");
        this.isConnected = IsConnectedStates.false;
        this.update(listRooms);
      });
  }

  public async onCreate(id: string | undefined) {
    console.log(this);
    return this.multiplayer
      .createJoinRoom(id ?? "", RoomTypes.SeparatedRoom, true, initialRoomData)
      .then((connection) => {
        console.log(`Connect to ${id} as main`);
        this.mainConnection.id = id;
        this.mainConnection.instance = connection;

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
          // this._divideHandler(id);
        });
      });

    return Promise.resolve("All handlers added");
  }
}
