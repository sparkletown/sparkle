import { CommonInterface } from "../Contructor/CommonInterface";
import { UsersMap } from "../Structures/UsersMap";

export class UsersDataProvider {
  public users = new UsersMap();

  constructor(readonly commonInterface: CommonInterface) {}

  public join(sessionId: number, playerId: string) {
    this.users.add(sessionId, playerId);
  }

  public left(sessionId: number) {
    this.users.remove(sessionId);
  }

  public update(sessionId: number, x: number, y: number, id: string) {
    return this.users.add(sessionId, id);
  }
}
