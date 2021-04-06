import { useMemo, useCallback } from "react";

import { User } from "types/User";
import { GridPosition } from "types/grid";

import { WithId } from "utils/id";
import { getPositionHash } from "utils/grid";

export interface UseGetUserByPosition {
  positionedUsers: readonly WithId<User>[];
  venueId?: string;
}

export const useGetUserByPosition: (
  props: UseGetUserByPosition
) => (gridPosition: GridPosition) => WithId<User> | undefined = ({
  positionedUsers,
  venueId,
}) => {
  const seatedUsersByHash = useMemo(
    () =>
      positionedUsers.reduce<Map<string, WithId<User> | undefined>>(
        (acc, user) => {
          if (!venueId) return acc;

          const gridData = user.data?.[venueId];

          if (!gridData) return acc;

          const { row, column } = gridData;

          const positionHash = getPositionHash({
            row,
            column,
          });

          return acc.set(positionHash, user);
        },
        new Map()
      ),
    [positionedUsers, venueId]
  );

  const getUserByPosition = useCallback(
    ({ row, column }: GridPosition) =>
      seatedUsersByHash.get(getPositionHash({ row, column })),
    [seatedUsersByHash]
  );

  return getUserByPosition;
};
