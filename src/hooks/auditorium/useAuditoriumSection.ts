import { useCallback, useMemo } from "react";

import {
  COLLECTION_SECTIONS,
  COLLECTION_SPACES,
  REACTIONS_CONTAINER_HEIGHT_IN_SEATS,
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
} from "settings";

import {
  setAuditoriumSectionSeat,
  unsetAuditoriumSectionSeat,
} from "api/venue";

import { AuditoriumSection } from "types/auditorium";
import { GridPosition } from "types/grid";
import { AuditoriumVenue } from "types/venues";

import { getVideoSizeInSeats } from "utils/auditorium";
import { WithId } from "utils/id";

import { useFireDocument } from "hooks/fire/useFireDocument";
import { useAuditoriumSeatedUsers } from "hooks/useAuditoriumSeatedUsers";

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

  const { userWithId } = useUser();
  const userId = userWithId?.id;

  const { data: section, isLoaded: isSectionLoaded } = useFireDocument<
    WithId<AuditoriumSection>
  >([COLLECTION_SPACES, venueId, COLLECTION_SECTIONS, sectionId]);

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

  const seatedUsers = useAuditoriumSeatedUsers({ venueId, sectionId });

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

      return setAuditoriumSectionSeat(
        userWithId,
        {
          row,
          column,
        },
        {
          venueId,
          sectionId,
        }
      );
    },
    [sectionId, venueId, userWithId]
  );

  const leaveSeat: () => Promise<void> | undefined = useCallback(() => {
    if (!venueId || !userId || !sectionId) return;

    return unsetAuditoriumSectionSeat(userId, { venueId, sectionId });
  }, [venueId, userId, sectionId]);

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
