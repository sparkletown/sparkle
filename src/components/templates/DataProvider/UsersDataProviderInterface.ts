import { ReplicatedUser } from "../GameInstanceCommonInterfaces";
import { UsersMap } from "../GameStructures";

export type UsersDataProviderInterface = {
  users: UsersMap;
  join: (sessionId: number, playerId: string) => void;
  left: (sessionId: number) => void;
  update: (sessionId: number, x: number, y: number, id: string) => boolean;
  updateUsers: (usersData: ReplicatedUser[]) => void;
  getUserByMessengerId: (messengerId: number) => ReplicatedUser | ReplicatedUser[] | undefined
}
