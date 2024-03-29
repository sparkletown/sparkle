import React, { useMemo } from "react";

import { SpaceId, SpaceWithId, WorldId } from "types/id";
import { User } from "types/User";

import { WithId } from "utils/id";

import { useManagedSpaces } from "hooks/spaces/useManagedSpaces";
import { usePresenceData } from "hooks/user/usePresence";

import { Loading } from "components/molecules/Loading";

import { Booth } from "./Booth";
import { BoothCreateCard } from "./BoothCreateCard";

import styles from "./BoothGrid.module.scss";

interface BoothGridProps {
  space: SpaceWithId;
  // Whether to allow more booths to be created, and if so, how many
  maxBooths?: number;
  user: WithId<User>;
}

export const BoothGrid: React.FC<BoothGridProps> = ({ space, user }) => {
  const { managedSpaces, isLoading: isLoadingManagedSpaces } = useManagedSpaces(
    {
      // @debt Ideally these IDs would be set to the right types on the objects
      // themselves
      worldId: space.worldId as WorldId,
      spaceId: space.id as SpaceId,
    }
  );

  const {
    presentUsersBySpace,
    isLoading: presentUsersLoading,
  } = usePresenceData({
    spaceIds: managedSpaces.map(({ id }) => id),
  });

  const visibleBooths = useMemo(
    () =>
      managedSpaces.filter(
        ({ id }) => (presentUsersBySpace[id] || []).length > 0
      ),
    [managedSpaces, presentUsersBySpace]
  );

  const renderedBooths = useMemo(() => {
    // Only show booths that have people in them
    const sortedSpaces = [...visibleBooths].sort(
      ({ createdAt: createdAtA }, { createdAt: createdAtB }) =>
        (createdAtA || 0) - (createdAtB || 0)
    );
    return sortedSpaces.map((boothSpace) => (
      <Booth
        key={boothSpace.id}
        space={boothSpace}
        presentUsers={presentUsersBySpace[boothSpace.id] || []}
      />
    ));
  }, [presentUsersBySpace, visibleBooths]);

  const allowCreate = space.maxBooths && visibleBooths.length < space.maxBooths;

  if (isLoadingManagedSpaces || presentUsersLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      {renderedBooths}
      {allowCreate && <BoothCreateCard parentSpace={space} />}
    </div>
  );
};
