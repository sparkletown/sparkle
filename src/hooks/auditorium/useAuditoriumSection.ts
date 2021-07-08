import { useCallback } from "react";

import { setGridData } from "api/profile";

import {
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
} from "settings";

import { GridPosition } from "types/grid";
import { AuditoriumVenue } from "types/venues";

import {
  convertToCartesianCoordinate,
  getAuditoriumSeatedUsers,
  getVideoSizeInSeats,
} from "utils/auditorium";
import { currentAuditoriumSectionsByIdSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "../useSelector";
import { isLoaded } from "../useFirestoreConnect";
import { useRecentVenueUsers } from "../users";
import { useUser } from "../useUser";
import { useGetUserByPosition } from "../useGetUserByPosition";

import { useConnectAllAuditoriumSections } from "./useAllAuditoriumSections";

export interface UseAuditoriumSectionProps {
  venue: WithId<AuditoriumVenue>;
  sectionId?: string;
}

export const useAuditoriumSection = ({
  venue,
  sectionId,
}: UseAuditoriumSectionProps) => {
  const {
    id: venueId,
    name: venueName,
    auditoriumColumns: venueColumnsCount,
    auditoriumRows: venueRowsCount,
  } = venue;

  useConnectAllAuditoriumSections(venueId);

  const { userWithId } = useUser();
  const userId = userWithId?.id;

  const { recentVenueUsers } = useRecentVenueUsers({ venueName });

  const sectionsById = useSelector(currentAuditoriumSectionsByIdSelector);
  const section = sectionId ? sectionsById?.[sectionId] : undefined;

  const baseRowsCount =
    section?.rowsCount ?? venueRowsCount ?? SECTION_DEFAULT_ROWS_COUNT;
  const baseColumnsCount =
    section?.columnsCount ?? venueColumnsCount ?? SECTION_DEFAULT_COLUMNS_COUNT;

  const { videoHeightInSeats, videoWidthInSeats } = getVideoSizeInSeats(
    baseColumnsCount
  );

  const seatedUsers = getAuditoriumSeatedUsers({
    auditoriumUsers: recentVenueUsers,
    venueId,
    sectionId,
  });

  const getUserBySeat = useGetUserByPosition({
    venueId,
    positionedUsers: seatedUsers,
  });

  const takeSeat: (
    gridPosition: GridPosition
  ) => Promise<void> | undefined = useCallback(
    ({ row, column }: GridPosition) => {
      if (!sectionId || !venueId || !userId) return;

      return setGridData({
        venueId,
        userId,
        gridData: { sectionId, row, column },
      });
    },
    [sectionId, venueId, userId]
  );

  const leaveSeat: () => Promise<void> | undefined = useCallback(() => {
    if (!venueId || !userId) return;

    return setGridData({ venueId, userId, gridData: undefined });
  }, [venueId, userId]);

  const checkIfSeat = useCallback(
    ({ row, column }: GridPosition) => {
      const covertedRowCoordinate = convertToCartesianCoordinate({
        index: row,
        totalAmount: baseRowsCount,
      });
      const convertedColumnCoordinate = convertToCartesianCoordinate({
        index: column,
        totalAmount: baseColumnsCount,
      });

      const isInVideoRow =
        Math.abs(covertedRowCoordinate) <= videoHeightInSeats / 2;
      const isInVideoColumn =
        Math.abs(convertedColumnCoordinate) <= videoWidthInSeats / 2;

      return !(isInVideoRow && isInVideoColumn);
    },
    [baseRowsCount, baseColumnsCount, videoHeightInSeats, videoWidthInSeats]
  );

  return {
    auditoriumSection: section,
    isAuditoriumSectionLoaded: isLoaded(sectionsById),

    baseRowsCount,
    baseColumnsCount,

    videoWidthInSeats,
    videoHeightInSeats,

    getUserBySeat,
    takeSeat,
    leaveSeat,
    checkIfSeat,
  };
};
