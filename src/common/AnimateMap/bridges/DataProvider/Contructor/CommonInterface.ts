// import { DocumentData, QuerySnapshot } from "@firebase/firestore-types";

// import { AnimateMapUser } from "common/AnimateMapCommon";

import { FirebaseDataProvider } from "./Firebase/FirebaseDataProvider";
import { PlayerIODataProvider } from "./PlayerIO/PlayerIODataProvider";
export interface User {
  id: string;
  name: string;
}

export enum RemoteTable {
  usersPosition = "usersPosition",
  usersIdBySession = "sessionIds",
}

/**
 * Major abstraction for providing query from GameInstance to cloud services.
 */
export interface CommonInterface {
  // loadUsersAsync(): Promise<User[]>;

  // getUser(id: string): User;

  // loadPlayerPositionAsync(
  // playerId: string,
  // successCallback: (dbObj: dbPlayer) => void,
  // errorCallback: (error: Error) => void
  // ): Promise<unknown>;

  sendPlayerPosition(x: number, y: number): void;
  sendShoutMessage(shout: string): void;

  // updateUsers(users: AnimateMapUser[]) : void;

  // loadVenuesAsync(): Promise<QuerySnapshot<DocumentData>>;
}

/**
 * Contructor of major abstraction for providing query from GameInstance to cloud services.
 */
export class CommonLinker implements CommonInterface {
  constructor(
    private _playerIOProvider: PlayerIODataProvider,
    private _firebaseProvider: FirebaseDataProvider
  ) {}

  // loadUsersAsync(): Promise<User[]> {
  //   return Promise.resolve([]);
  // }

  // loadPlayerPositionAsync(
  // playerId: string,
  // successCallback: (dbObj: dbPlayer) => void,
  // errorCallback: (error: Error) => void
  // ) {
  // return this._playerIOProvider.load(
  //   RemoteTable.usersPosition,
  // playerId,
  // successCallback as (dbObj: dbPlayer | idObject) => void,
  // errorCallback
  // );
  // }

  sendPlayerPosition(x: number, y: number) {
    this._playerIOProvider.sendPlayerPosition(x, y);
  }

  sendShoutMessage(shout: string) {
    this._playerIOProvider.sendShoutMessage(shout);
  }

  // updateUsers(users: ReplicatedUser[]): void {
  //   this.
  // }

  // loadVenuesAsync() {
  //   return this._firebaseProvider.loadVenue();
  // }
}
