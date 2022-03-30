import { useMemo } from "react";

import { ALWAYS_EMPTY_ARRAY, PATH } from "settings";

import { SpaceId, UserId, WorldId } from "types/id";

import { useLiveDocument } from "hooks/fire/useLiveDocument";
import { useSpaceById } from "hooks/spaces/useSpaceById";
import { useWorldById } from "hooks/worlds/useWorldById";

type AdminRole = {
  allowAll: boolean;
  users: string[];
};

type UsePermissionOptions = {
  userId: UserId;
  worldId?: WorldId;
  spaceId?: SpaceId;
};

export const usePermission = (options: UsePermissionOptions) => {
  const {
    data: role,
    error: roleError,
    isLoading: roleLoading,
  } = useLiveDocument<AdminRole>(PATH.rolesAdmin);

  const { userId, worldId, spaceId } = options;

  const { world, isLoading: isWorldLoading, error: worldError } = useWorldById({
    worldId,
  });

  const { space, isLoading: isSpaceLoading, error: spaceError } = useSpaceById({
    spaceId,
  });

  return useMemo(() => {
    const isWorldOwner = !isWorldLoading && world?.owners.includes(userId);
    const isSpaceOwner = !isSpaceLoading && space?.owners?.includes(userId);

    const users = role?.users;
    const ids = !roleLoading && users ? role?.users : ALWAYS_EMPTY_ARRAY;
    const isSuperAdmin = userId && ids.includes(userId);

    const isLoading = isWorldLoading || isSpaceLoading || roleLoading;
    const isLoaded = !isLoading;

    const isAdmin = isSuperAdmin;
    const isNotAdmin = !isAdmin;

    const error = roleError ?? worldError ?? spaceError;

    return {
      error,
      isAdmin,
      isNotAdmin,
      isSuperAdmin,
      isWorldOwner,
      isSpaceOwner,
      isLoading,
      isLoaded,
      superAdminIds: ids,
    };
  }, [
    isSpaceLoading,
    isWorldLoading,
    role?.users,
    roleError,
    roleLoading,
    space?.owners,
    spaceError,
    userId,
    world?.owners,
    worldError,
  ]);
};
