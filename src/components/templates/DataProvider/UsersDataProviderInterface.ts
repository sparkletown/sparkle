import { UsersMap } from "../AnimateMap/bridges/DataProvider/Structures/UsersMap";
import { ReplicatedUser } from "../GameInstanceCommonInterfaces";

export type UsersDataProviderInterface = {
  users: UsersMap;
  join: (sessionId: number, playerId: string) => void;
  left: (sessionId: number) => void;
  update: (sessionId: number, x: number, y: number, id: string) => boolean;
  updateUsers: (usersData: ReplicatedUser[]) => void;
  getUserByMessengerId: (messengerId: number) => ReplicatedUser | ReplicatedUser[] | undefined
}
