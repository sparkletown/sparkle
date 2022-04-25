import { Point } from "types/utility";

import { ProxyMultiplayer } from "../../../../../vendors/playerio/PromissesWrappers/ProxyMultiplayer";
import EventProvider, {
  EventType,
} from "../../../../EventProvider/EventProvider";
import { CloudDataProvider } from "../../../CloudDataProvider";
import { initialRoomData, RoomInfoType } from "../../../Structures/RoomsModel";
import { FindMessageTuple, MessagesTypes, RoomTypes } from "../types";

import { IPlayerIORoomOperator } from "./IPlayerIORoomOperator";
import { ConnectionWrapper } from "./PlayerIORoomOperator";

enum IsConnectedStates {
  false = 0,
  true,
  inProgress,
}

export class PlayerIOSeparatedRoomOperator implements IPlayerIORoomOperator {
  mainConnection: ConnectionWrapper = {};
  position: Point;

  public constructor(
    readonly cloudDataProvider: CloudDataProvider,
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
      .filter(
        (room) =>
          room.onlineUsers <
          this.cloudDataProvider.settings.playerioMaxPlayerPerRoom
      )
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
          const user = this.cloudDataProvider.users.getUserByMessengerId(
            parseInt(userId)
          );
          if (!user || Array.isArray(user)) return console.error("Bad user");
          user.x = x;
          user.y = y;
          if (this.playerId !== user.data.id)
            EventProvider.emit(EventType.USER_JOINED, user);
        });

        connection.addMessageCallback<
          FindMessageTuple<MessagesTypes.processedMove>
        >(MessagesTypes.processedMove, (m) => {
          const innerUserId = m.getULong(0);
          const x = m.getUInt(1);
          const y = m.getUInt(2);
          const user = this.cloudDataProvider.users.getUserByMessengerId(
            innerUserId
          );
          if (!user || Array.isArray(user)) return console.error("Bad user");
          user.x = x;
          user.y = y;
          if (this.playerId !== user.data.id)
            EventProvider.emit(EventType.USER_MOVED, user);
        });

        connection.addMessageCallback<
          FindMessageTuple<MessagesTypes.processedMoveReserve>
        >(MessagesTypes.processedMoveReserve, (m) => {
          const innerUserId = m.getString(0);
          const x = m.getUInt(1);
          const y = m.getUInt(2);
          const user = this.cloudDataProvider.users.getUserByMessengerId(
            //todo: add getUserById
            parseInt(innerUserId)
          );
          if (!user || Array.isArray(user)) return console.error("Bad user");
          user.x = x;
          user.y = y;
          if (this.playerId !== user.data.id)
            EventProvider.emit(EventType.USER_MOVED, user);
        });

        connection.addMessageCallback<
          FindMessageTuple<MessagesTypes.processedShout>
        >(MessagesTypes.processedShout, (m) => {
          const innerUserId = m.getULong(0);
          const shout: string = m.getString(1);
          const user = this.cloudDataProvider.users.getUserByMessengerId(
            innerUserId
          );
          if (!user || Array.isArray(user)) return console.error("Bad user");
          EventProvider.emit(EventType.RECEIVE_SHOUT, user.data.id, shout);
        });

        connection.addMessageCallback<
          FindMessageTuple<MessagesTypes.processedShoutReserve>
        >(MessagesTypes.processedShoutReserve, (m) => {
          const innerUserId = m.getString(0);
          const shout = m.getString(1);
          const user = this.cloudDataProvider.users.getUserByMessengerId(
            //todo: add getUserById
            parseInt(innerUserId)
          );
          if (!user || Array.isArray(user)) return console.error("Bad user");
          EventProvider.emit(EventType.RECEIVE_SHOUT, user.data.id, shout);
        });

        connection.addMessageCallback<FindMessageTuple<MessagesTypes.userLeft>>(
          MessagesTypes.userLeft,
          (m) => {
            const innerUserId = m.getString(0);
            console.log(`User ${innerUserId} left from ${id}`);
            const user = this.cloudDataProvider.users.getUserByMessengerId(
              parseInt(innerUserId)
            );
            if (!user || Array.isArray(user)) return console.error("Bad user");
            if (this.playerId !== user.data.id)
              EventProvider.emit(EventType.USER_LEFT, user);
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
