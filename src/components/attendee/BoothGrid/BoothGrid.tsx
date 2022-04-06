import React, { useMemo } from "react";

import { SpaceId, WorldId } from "types/id";
import { User } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useManagedSpaces } from "hooks/spaces/useManagedSpaces";

import { Loading } from "components/molecules/Loading";

import { Booth } from "./Booth";

import styles from "./BoothGrid.module.scss";

interface BoothGridProps {
  space: WithId<AnyVenue>;
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

  const renderedBooths = useMemo(() => {
    const sortedSpaces = [
      ...managedSpaces,
    ].sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));
    return sortedSpaces.map((boothSpace) => (
      <Booth key={boothSpace.id} space={boothSpace} />
    ));
  }, [managedSpaces]);

  if (isLoadingManagedSpaces) {
    return <Loading />;
  }

  return <div className={styles.container}>{renderedBooths}</div>;
};
