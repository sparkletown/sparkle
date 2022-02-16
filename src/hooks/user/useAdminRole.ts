import { isNil } from "lodash/fp";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_ROLES } from "settings";

import { LoadStatus } from "types/fire";
import { UserId } from "types/id";

import { WithId } from "utils/id";

import { useRefiDocument } from "hooks/fire/useRefiDocument";
import { useOwnedVenues } from "hooks/useOwnedVenues";
import { useOwnWorlds } from "hooks/worlds/useOwnWorlds";

export type AdminRole = {
  allowAll: boolean;
  users: string[];
};

export type UseAdminRole = (options: {
  userId: string;
}) => LoadStatus & {
  adminRole: WithId<AdminRole>;
  adminUserIds: string[];
  isAdminUser: boolean;
  isNotAdminUser: boolean;
};

export const useAdminRole: UseAdminRole = ({ userId }) => {
  const { data: adminRole, isLoading, error } = useRefiDocument<AdminRole>([
    COLLECTION_ROLES,
    "admin",
  ]);

  const { isLoading: isOwnWorldsLoading, ownWorlds } = useOwnWorlds({ userId });
  const isAnyWorldOwner = !isOwnWorldsLoading && ownWorlds.length > 0;

  const { ownedVenues, isLoading: isOwnVenuesLoading } = useOwnedVenues({
    userId: userId as UserId,
  });
  const isAnySpaceOwner = !isOwnVenuesLoading && ownedVenues.length > 0;

  const adminUserIds =
    !isLoading && adminRole?.users ? adminRole.users : ALWAYS_EMPTY_ARRAY;

  const isAdminUser = !isNil(userId) && adminUserIds.includes(userId);

  return {
    adminRole,
    adminUserIds,
    isAdminUser,
    isNotAdminUser: !isAdminUser && !isAnyWorldOwner && !isAnySpaceOwner,
    isLoading,
    isLoaded: !isLoading,
    error,
  };
};
