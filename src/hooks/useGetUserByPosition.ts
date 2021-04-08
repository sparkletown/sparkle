import { useMemo, useCallback } from "react";

import { User } from "types/User";
import { GridPosition } from "types/grid";

import { WithId } from "utils/id";
import { getPositionHash } from "utils/grid";

export interface UseGetUserByPositionProps {
  positionedUsers: readonly WithId<User>[];
  venueId?: string;
}

export type GetUserByPostion = (
  gridPosition: GridPosition
) => WithId<User> | undefined;

export const useGetUserByPosition: (
  props: UseGetUserByPositionProps
) => GetUserByPostion = ({ positionedUsers, venueId }) => {
  const seatedUsersByHash: Map<string, WithId<User>> = useMemo(
    () =>
      positionedUsers.reduce<Map<string, WithId<User>>>((acc, user) => {
        if (!venueId) return acc;

        const gridData = user.data?.[venueId];

        if (!gridData?.row || !gridData?.column) return acc;

        const { row, column } = gridData;

        const positionHash = getPositionHash({
          row,
          column,
        });

        return acc.set(positionHash, user);
      }, new Map()),
    [positionedUsers, venueId]
  );

  const getUserByPosition: GetUserByPostion = useCallback(
    ({ row, column }) =>
      seatedUsersByHash.get(getPositionHash({ row, column })),
    [seatedUsersByHash]
  );

  return getUserByPosition;
};
