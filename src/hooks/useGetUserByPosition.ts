import { useCallback, useMemo } from "react";

import { SeatPosition } from "types/grid";
import { SeatedUser } from "types/User";

import { WithId } from "utils/id";
import { isDefined } from "utils/types";

export type GetUserByPosition = (
  seatPosition: SeatPosition
) => WithId<SeatedUser<SeatPosition>> | undefined;

export const useGetUserByPosition = (
  seatedUsers: WithId<SeatedUser<SeatPosition>>[]
): GetUserByPosition => {
  const seatedUsersByHash: Map<
    number,
    WithId<SeatedUser<SeatPosition>>
  > = useMemo(
    () =>
      seatedUsers.reduce<Map<number, WithId<SeatedUser<SeatPosition>>>>(
        (acc, user) => {
          const { seatIndex } = user.seatData;

          if (!isDefined(seatIndex)) return acc;

          return acc.set(seatIndex, user);
        },
        new Map()
      ),
    [seatedUsers]
  );

  return useCallback(({ seatIndex }) => seatedUsersByHash.get(seatIndex), [
    seatedUsersByHash,
  ]);
};
