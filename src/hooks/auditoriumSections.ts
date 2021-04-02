import { User } from "types/User";

import { setGridData } from "api/profile";

import {
  currentAuditoriumSectionsSelector,
  currentAuditoriumSectionsByIdSelector,
} from "utils/selectors";
import { WithId } from "utils/id";
import { getPositionHash } from "utils/auditorium";

import { useSelector } from "./useSelector";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";
import { useRecentVenueUsers } from "./users";
import { useUser } from "./useUser";
import { useCallback, useMemo } from "react";

const useConnectAuditoriumSections = (venueId?: string) => {
  useFirestoreConnect(() => {
    if (!venueId) return [];

    return [
      {
        collection: "venues",
        doc: venueId,
        subcollections: [{ collection: "sections" }],
        storeAs: "currentAuditoriumSections",
      },
    ];
  });
};

export interface UseAuditoriumSectionProps {
  sectionId: string;
  venueId?: string;
}

export const useAuditoriumSection = ({
  venueId,
  sectionId,
}: UseAuditoriumSectionProps) => {
  useConnectAuditoriumSections(venueId);

  const { userWithId } = useUser();
  const userId = userWithId?.id;

  const sectionsById = useSelector(currentAuditoriumSectionsByIdSelector);
  const section = sections?.[sectionId];

  const seatedUsers = useSectionSeatedUsers(venueId, sectionId);

  const seatedUsersByHash = useMemo(
    () =>
      seatedUsers.reduce<Record<string, WithId<User> | undefined>>(
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
    [seatedUsers, venueId]
  );

  const getUserBySeat = useCallback(
    ({ row, column }: { row: number; column: number }) =>
      seatedUsersByHash?.[getPositionHash({ row, column })],
    [seatedUsersByHash]
  );

  const takeSeat = useCallback(
    ({ row, column }: { row: number; column: number }) => {
      if (!sectionId || !venueId || !userId) return;

      setGridData({
        venueId,
        userId,
        seatOptions: { sectionId, row, column },
      });
    },
    [sectionId, venueId, userId]
  );

  const leaveSeat = useCallback(() => {
    if (!venueId || !userId) return;

    setGridData({ venueId, userId, seatOptions: null });
  }, [venueId, userId]);

  return {
    auditoriumSection: section,
    isAuditoriumSectionLoaded: isLoaded(sections),
    getUserBySeat,
    takeSeat,
    leaveSeat,
  };
};

export const useSectionSeatedUsers = (venueId?: string, sectionId?: string) => {
  const { recentVenueUsers } = useRecentVenueUsers();

  return useMemo(
    () =>
      recentVenueUsers.filter(
        (user) =>
          venueId && sectionId && user.data?.[venueId]?.sectionId === sectionId
      ),
    [recentVenueUsers, venueId, sectionId]
  );
};

export const useAuditoriumSections = (venueId?: string) => {
  useConnectAuditoriumSections(venueId);

  const sections = useSelector(currentAuditoriumSectionsSelector);

  return useMemo(
    () => ({
      auditoriumSections: sections ?? [],
      isAuditoriumSectionsLoaded: isLoaded(sections),
    }),
    [sections]
  );
};
