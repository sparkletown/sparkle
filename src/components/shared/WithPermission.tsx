import React, { ReactNode } from "react";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useLivePermission } from "hooks/user/useLivePermission";
import { useUserId } from "hooks/user/useUserId";

type AdminRestrictedProps = {
  check: "super" | "world" | "space";
  fallback: ReactNode;
  loading: ReactNode;
};

export const WithPermission: React.FC<AdminRestrictedProps> = ({
  check,
  loading = null,
  fallback = null,
  children,
}) => {
  const {
    worldId,
    spaceId,
    isLoading: isLoadingIds,
  } = useWorldAndSpaceByParams();
  const { userId, isLoading: isLoadingUserId } = useUserId();
  const {
    isSuperAdmin,
    isWorldOwner,
    isSpaceOwner,
    isLoading: isLoadingRole,
  } = useLivePermission({ userId, worldId, spaceId });

  if (isLoadingUserId || isLoadingRole || isLoadingIds) {
    return <>{loading}</>;
  }

  if (check === "super" && isSuperAdmin) return <>{children}</>;
  if (check === "world" && isWorldOwner) return <>{children}</>;
  if (check === "space" && isSpaceOwner) return <>{children}</>;

  return <>{fallback}</>;
};
