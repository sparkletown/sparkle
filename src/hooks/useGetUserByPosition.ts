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
      positionedUsers.reduce<Record<string, WithId<User> | undefined>>(
        (acc, user) => {
          if (!venueId) return acc;

          const takenRow = user.data?.[venueId]?.row;
          const takenColumn = user.data?.[venueId]?.column;

          if (takenRow === undefined || takenColumn === undefined) return acc;

          const positionHash = getPositionHash({
            row: takenRow,
            column: takenColumn,
          });

          return { ...acc, [positionHash]: user };
        },
        {}
      ),
    [positionedUsers, venueId]
  );

  const getUserByPosition = useCallback(
    ({ row, column }: GridPosition) =>
      seatedUsersByHash?.[getPositionHash({ row, column })],
    [seatedUsersByHash]
  );

  return getUserByPosition;
};
