import { useCallback, useMemo } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";

import {
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

import {
  convertToCartesianCoordinate,
  getVideoSizeInSeats,
} from "utils/auditorium";
import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

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

  const firestore = useFirestore();

  const { userWithId } = useUser();
  const userId = userWithId?.id;

  const sectionRef = firestore
    .collection("venues")
    .doc(venueId)
    .collection("sections")
    .doc(sectionId)
    .withConverter(withIdConverter);

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

  const checkIfSeat = useCallback(
    ({ row, column }: GridPosition) => {
      const convertedRowCoordinate = convertToCartesianCoordinate({
        index: row,
        totalAmount: baseRowsCount,
      });
      const convertedColumnCoordinate = convertToCartesianCoordinate({
        index: column,
        totalAmount: baseColumnsCount,
      });

      const isInVideoRow =
        Math.abs(convertedRowCoordinate) <= screenHeightInSeats / 2;
      const isInVideoColumn =
        Math.abs(convertedColumnCoordinate) <= screenWidthInSeats / 2;

      return !(isInVideoRow && isInVideoColumn);
    },
    [baseRowsCount, baseColumnsCount, screenHeightInSeats, screenWidthInSeats]
  );

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
    checkIfSeat,
  };
};
