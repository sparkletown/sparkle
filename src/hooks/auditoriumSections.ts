import { useCallback, useMemo } from "react";

import { setGridData } from "api/profile";

import { GridPosition } from "types/grid";

import {
  currentAuditoriumSectionsSelector,
  currentAuditoriumSectionsByIdSelector,
} from "utils/selectors";

import { useSelector } from "./useSelector";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";
import { useRecentVenueUsers } from "./users";
import { useUser } from "./useUser";
import { useGetUserByPosition } from "./useGetUserByPosition";

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
  sectionId?: string;
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
  const section = sectionId ? sectionsById?.[sectionId] : undefined;

  const seatedUsers = useSectionSeatedUsers(venueId, sectionId);

  const getUserBySeat = useGetUserByPosition({
    venueId,
    positionedUsers: seatedUsers,
  });

  const takeSeat = useCallback(
    ({ row, column }: GridPosition) => {
      if (!sectionId || !venueId || !userId) return;

      setGridData({
        venueId,
        userId,
        gridData: { sectionId, row, column },
      });
    },
    [sectionId, venueId, userId]
  );

  const leaveSeat = useCallback(() => {
    if (!venueId || !userId) return;

    setGridData({ venueId, userId, gridData: null });
  }, [venueId, userId]);

  return {
    auditoriumSection: section,
    isAuditoriumSectionLoaded: isLoaded(sectionsById),
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
