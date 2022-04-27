import { SpaceWithId, WithId } from "../AnimateMapIds";
import { User } from "../AnimateMapUser";

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
