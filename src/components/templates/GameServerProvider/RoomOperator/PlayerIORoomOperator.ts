import { Point } from "types/utility";

import { DataProvider } from "../../DataProvider";
import { EventProvider, EventType } from "../../EventProvider";
import { initialRoomData } from "../../GameStructures";
import { ProxyConnection } from "../../PlayerIO/PromissesWrappers/ProxyConnection";
import { ProxyMultiplayer } from "../../PlayerIO/PromissesWrappers/ProxyMultiplayer";
import { FindMessageTuple, MessagesTypes, RoomTypes } from "../types";

import { NinePartRoomOperator } from "./RoomLogic/NinePartRoomOperator";
import { IPlayerIORoomOperator } from "./IPlayerIORoomOperator";;

export interface ConnectionWrapper {
  id?: string;
  instance?: ProxyConnection;
}

/**
 * Main logic class for working with rooms
 */
export class PlayerIORoomOperator
  extends NinePartRoomOperator
  implements IPlayerIORoomOperator {
  public mainConnection: ConnectionWrapper = {};
  public peripheralConnections: ConnectionWrapper[] = [];

  public constructor(
    readonly dataProvider: DataProvider,
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
          const user = this.dataProvider.users.getUserByMessengerId(
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
          const user = this.dataProvider.users.getUserByMessengerId(
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
          const user = this.dataProvider.users.getUserByMessengerId(
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
          const user = this.dataProvider.users.getUserByMessengerId(
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
          const user = this.dataProvider.users.getUserByMessengerId(
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
            const user = this.dataProvider.users.getUserByMessengerId(
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
