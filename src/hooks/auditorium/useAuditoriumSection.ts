import { useCallback, useMemo } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { doc, where } from "firebase/firestore";

import {
  COLLECTION_SECTIONS,
  COLLECTION_SPACES,
  REACTIONS_CONTAINER_HEIGHT_IN_SEATS,
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
} from "settings";

import { setSeat, unsetSeat } from "api/world";

import { AuditoriumSection } from "types/auditorium";
import { GridPosition, SectionGridData } from "types/grid";
import { AuditoriumVenue } from "types/venues";

import { getVideoSizeInSeats } from "utils/auditorium";
import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

import { useSeatedUsers } from "hooks/useSeatedUsers";

import { useGetUserByPosition } from "../useGetUserByPosition";
import { useUser } from "../useUser";

export interface UseAuditoriumSectionProps {
  venue: WithId<AuditoriumVenue>;
  sectionId: string;
}

export const useAuditoriumSection = ({
  venue,
  sectionId,
}: UseAuditoriumSectionProps) => {
  const {
    id: venueId,
    auditoriumColumns: venueColumnsCount,
    auditoriumRows: venueRowsCount,
  } = venue;

  const firestore = useFirestore();

  const { userWithId } = useUser();
  const userId = userWithId?.id;

  const sectionRef = doc(
    firestore,
    COLLECTION_SPACES,
    venueId,
    COLLECTION_SECTIONS,
    sectionId
  ).withConverter(withIdConverter<AuditoriumSection>());

  const { data: section, status } = useFirestoreDocData<
    WithId<AuditoriumSection>
  >(sectionRef);

  const isSectionLoaded = status !== "loading";

  const baseRowsCount =
    section?.rowsCount ?? venueRowsCount ?? SECTION_DEFAULT_ROWS_COUNT;
  const baseColumnsCount =
    section?.columnsCount ?? venueColumnsCount ?? SECTION_DEFAULT_COLUMNS_COUNT;

  const { videoHeightInSeats, videoWidthInSeats } = getVideoSizeInSeats(
    baseColumnsCount
  );

  const screenHeightInSeats =
    videoHeightInSeats + REACTIONS_CONTAINER_HEIGHT_IN_SEATS;
  const screenWidthInSeats = videoWidthInSeats;

  const { users: seatedUsers } = useSeatedUsers<SectionGridData>({
    worldId: venue.worldId,
    spaceId: venueId,
    additionalWhere: [where("seatedData.sectionId", "==", sectionId)],
  });

  const isUserSeated = useMemo(
    () => seatedUsers?.some((seatedUser) => seatedUser.id === userId),
    [seatedUsers, userId]
  );

  const getUserBySeat = useGetUserByPosition(seatedUsers);

  const takeSeat: (
    gridPosition: GridPosition
  ) => Promise<void> | undefined = useCallback(
    ({ row, column }: GridPosition) => {
      if (!sectionId || !venueId || !userWithId) return;

      return setSeat<SectionGridData>({
        user: userWithId,
        worldId: venue.worldId,
        spaceId: venueId,
        seatData: {
          sectionId,
          row,
          column,
        },
      });
    },
    [sectionId, venueId, userWithId, venue.worldId]
  );

  const leaveSeat: () => Promise<void> | undefined = useCallback(() => {
    if (!venueId || !userId || !sectionId) return;

    return unsetSeat({ userId, worldId: venue.worldId });
  }, [venueId, userId, sectionId, venue.worldId]);

  return {
    auditoriumSection: section,
    isAuditoriumSectionLoaded: isSectionLoaded,

    baseRowsCount,
    baseColumnsCount,

    screenWidthInSeats,
    screenHeightInSeats,

    isUserSeated,

    getUserBySeat,
    takeSeat,
    leaveSeat,
  };
};
