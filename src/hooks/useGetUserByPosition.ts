import { useCallback, useMemo } from "react";

import { GridPosition } from "types/grid";
import { GridSeatedUser, User } from "types/User";

import { WithId } from "utils/id";
import { isDefined } from "utils/types";

export interface UseGetUserByPositionProps {
  positionedUsers: readonly WithId<User>[];
  venueId?: string;
}

export type GetUserByPosition = (
  gridPosition: GridPosition
) => WithId<GridSeatedUser> | undefined;

const getPositionHash = ({ row, column }: GridPosition): string => {
  return `${row}|${column}`;
};

export const useGetUserByPosition = (
  gridSeatedUsers: WithId<GridSeatedUser>[]
): GetUserByPosition => {
  const seatedUsersByHash: Map<string, WithId<GridSeatedUser>> = useMemo(
    () =>
      gridSeatedUsers.reduce<Map<string, WithId<GridSeatedUser>>>(
        (acc, user) => {
          const { row, column } = user.position;

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
