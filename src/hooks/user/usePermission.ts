import { useMemo } from "react";

import { ALWAYS_EMPTY_ARRAY, PATH } from "settings";

import { SpaceId, UserId, WorldId } from "types/id";

import { useLiveDocument } from "hooks/fire/useLiveDocument";
import { useSpacesByOwner } from "hooks/spaces/useSpacesByOwner";
import { useWorldsByOwner } from "hooks/worlds/useWorldsByOwner";

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

  const {
    ownWorlds,
    error: worldsError,
    isLoading: worldLoading,
  } = useWorldsByOwner(options);

  const {
    ownSpaces,
    error: spacesError,
    isLoading: spacesLoading,
  } = useSpacesByOwner(options);

  const { userId, worldId, spaceId } = options;

  return useMemo(() => {
    const isAnyWorldOwner = !worldLoading && ownWorlds?.length > 0;
    const isAnySpaceOwner = !spacesLoading && ownSpaces?.length > 0;

    const isWorldOwner =
      !worldLoading && ownWorlds?.find(({ id }) => id === worldId);
    const isSpaceOwner =
      !spacesLoading && ownSpaces?.find(({ id }) => id === spaceId);

    const users = role?.users;
    const ids = !roleLoading && users ? role?.users : ALWAYS_EMPTY_ARRAY;
    const isSuperAdmin = userId && ids.includes(userId);

    const isLoading = worldLoading || spacesLoading || roleLoading;
    const isLoaded = !isLoading;

    const isAdmin = isSuperAdmin || isAnyWorldOwner || isAnySpaceOwner;
    const isNotAdmin = !isAdmin;

    const error = roleError ?? worldsError ?? spacesError;

    return {
      error,
      isAdmin,
      isNotAdmin,
      isSuperAdmin,
      isAnyWorldOwner,
      isAnySpaceOwner,
      isWorldOwner,
      isSpaceOwner,
      isLoading,
      isLoaded,
      superAdminIds: ids,
      ownWorlds,
      ownSpaces,
    };
  }, [
    role,
    roleError,
    worldsError,
    spacesError,
    roleLoading,
    worldLoading,
    spacesLoading,
    ownSpaces,
    ownWorlds,
    userId,
    worldId,
    spaceId,
  ]);
};
