import { useCallback, useMemo } from "react";

import { GridPosition } from "types/grid";
import { SeatedUser, User } from "types/User";

import { WithId } from "utils/id";
import { isDefined } from "utils/types";

export interface UseGetUserByPositionProps {
  positionedUsers: readonly WithId<User>[];
  venueId?: string;
}

export type GetUserByPosition = (
  gridPosition: GridPosition
) => WithId<SeatedUser<GridPosition>> | undefined;

const getPositionHash = ({ row, column }: GridPosition): string => {
  return `${row}|${column}`;
};

export const useGetUserByPosition = (
  gridSeatedUsers: WithId<SeatedUser<GridPosition>>[]
): GetUserByPosition => {
  const seatedUsersByHash: Map<
    string,
    WithId<SeatedUser<GridPosition>>
  > = useMemo(
    () =>
      gridSeatedUsers.reduce<Map<string, WithId<SeatedUser<GridPosition>>>>(
        (acc, user) => {
          const { row, column } = user.seatData;

          if (!isDefined(row) || !isDefined(column)) return acc;

          const positionHash = getPositionHash({
            row,
            column,
          });

          return acc.set(positionHash, user);
        },
        new Map()
      ),
    [gridSeatedUsers]
  );

  return useCallback(
    ({ row, column }) =>
      seatedUsersByHash.get(getPositionHash({ row, column })),
    [seatedUsersByHash]
  );
};
