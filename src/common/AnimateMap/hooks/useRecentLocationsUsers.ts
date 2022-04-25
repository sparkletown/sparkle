import { SpaceWithId } from "types/id";
import { User } from "types/User";

import { WithId } from "utils/id";

export interface RecentLocationsUsersData {
  isSuccess: boolean;
  name: string;
  id: string;
  users: readonly WithId<User>[];
}

// @debt Beavers need to refactor this

export const useRecentLocationsUsers = (
  venues: SpaceWithId[]
): Array<RecentLocationsUsersData> => [];
