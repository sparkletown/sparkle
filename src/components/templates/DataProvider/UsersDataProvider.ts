import { ReplicatedUser } from "store/reducers/AnimateMap";

import { CommonInterface } from "../CommonInterface";
import { UsersMap } from "../GameStructures";

import { UsersDataProviderInterface } from "./UsersDataProviderInterface";

export class UsersDataProvider implements UsersDataProviderInterface {
  public users = new UsersMap();

  constructor(readonly commonInterface: CommonInterface) { }

  public join(sessionId: number, playerId: string) {
    this.users.add(sessionId, playerId);
  }

  public left(sessionId: number) {
    this.users.remove(sessionId);
  }

  public update(sessionId: number, x: number, y: number, id: string): boolean {
    return this.users.add(sessionId, id);
  }

  public updateUsers(usersData: ReplicatedUser[]) {
    usersData.forEach((user) =>
      // this.users.add(user.data.messengerId, user.data.id)
      this.users.addReplicatedUser(user)
    );
  }

  public getUserByMessengerId(messengerId: number) {
    return this.users.getUser(messengerId);
  }
}
