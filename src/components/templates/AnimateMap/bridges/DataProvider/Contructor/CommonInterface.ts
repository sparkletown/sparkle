import { PlayerIODataProvider } from "./PlayerIODataProvider";
import { dbPlayer, idObject } from "../Providers/PlayerDataProvider";
import { FirebaseDataProvider } from "./FirebaseDataProvider";

export interface User {
  id: string;
  name: string;
}

export enum RemoteTable {
  usersPosition = "usersPosition",
  usersIdBySession = "sessionIds",
}

export enum MessageType {
  move = "m",
}

/**
 * Major abstraction for providing query from GameInstance to cloud services.
 */
export interface CommonInterface {
  loadUsersAsync(): Promise<User[]>;

  // getUser(id: string): User;

  loadPlayerPositionAsync(
    playerId: string,
    successCallback: (dbObj: dbPlayer) => void,
    errorCallback: (error: Error) => void
  ): Promise<unknown>;

  sendPlayerPosition(sessionId: number, x: number, y: number, id: string): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadVenuesAsync(): any;
}

/**
 * Contructor of major abstraction for providing query from GameInstance to cloud services.
 */
export class CommonLinker implements CommonInterface {
  constructor(
    private _playerIOProvider: PlayerIODataProvider<dbPlayer | idObject>,
    private _firebaseProvider: FirebaseDataProvider
  ) {}

  loadUsersAsync(): Promise<User[]> {
    return Promise.resolve([]);
  }

  loadPlayerPositionAsync(
    playerId: string,
    successCallback: (dbObj: dbPlayer) => void,
    errorCallback: (error: Error) => void
  ) {
    return this._playerIOProvider.load(
      RemoteTable.usersPosition,
      playerId,
      successCallback as (dbObj: dbPlayer | idObject) => void,
      errorCallback
    );
  }

  sendPlayerPosition(
    sessionId: number,
    x: number,
    y: number,
    id: string
  ): void {
    this._playerIOProvider.sendPlayerPosition(
      MessageType.move,
      sessionId,
      x,
      y,
      id
    );
  }

  loadVenuesAsync() {
    return this._firebaseProvider.loadVenue();
  }
}
