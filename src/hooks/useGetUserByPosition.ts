import { useCallback, useMemo } from "react";
import { pick } from "lodash";

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

export const useGetUserByPositionOld: (
  props: UseGetUserByPositionProps
) => GetUserByPosition = ({ positionedUsers, venueId }) => {
  const gridSeatedUsers = venueId
    ? positionedUsers.map((user) => {
        const { row, column } = user.data?.[venueId] ?? {};

        return {
          ...user,
          row,
          column,
        };
      })
    : [];

  return useGetUserByPosition(gridSeatedUsers);
};

export const useGetUserByPosition = (
  gridSeatedUsers: WithId<GridSeatedUser>[]
): GetUserByPosition => {
  const seatedUsersByHash: Map<string, WithId<GridSeatedUser>> = useMemo(
    () =>
      gridSeatedUsers.reduce<Map<string, WithId<GridSeatedUser>>>(
        (acc, user) => {
          const { row, column } = pick(user, "row", "column");

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
