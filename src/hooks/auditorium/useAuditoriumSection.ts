import { useCallback } from "react";

import { setGridData } from "api/profile";

import {
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
  SECTION_VIDEO_MIN_WIDTH_IN_SEATS,
} from "settings";

import { GridPosition } from "types/grid";

import {
  convertToCartesianCoordinate,
  getAuditoriumSeatedUsers,
} from "utils/auditorium";
import { currentAuditoriumSectionsByIdSelector } from "utils/selectors";

import { useSelector } from "../useSelector";
import { isLoaded } from "../useFirestoreConnect";
import { useRecentVenueUsers } from "../users";
import { useUser } from "../useUser";
import { useGetUserByPosition } from "../useGetUserByPosition";

import { useConnectAllAuditoriumSections } from "./useAllAuditoriumSections";

export interface UseAuditoriumSectionProps {
  venueRowsCount?: number;
  venueColumnsCount?: number;
  sectionId?: string;
  venueId?: string;
}

export const useAuditoriumSection = ({
  venueId,
  sectionId,
  venueRowsCount,
  venueColumnsCount,
}: UseAuditoriumSectionProps) => {
  useConnectAllAuditoriumSections(venueId);

  const { userWithId } = useUser();
  const userId = userWithId?.id;

  const { recentVenueUsers } = useRecentVenueUsers();

  const sectionsById = useSelector(currentAuditoriumSectionsByIdSelector);
  const section = sectionId ? sectionsById?.[sectionId] : undefined;

  const baseRowsCount =
    section?.rowsCount ?? venueRowsCount ?? SECTION_DEFAULT_ROWS_COUNT;
  const baseColumnsCount =
    section?.columnsCount ?? venueColumnsCount ?? SECTION_DEFAULT_COLUMNS_COUNT;

  // Video takes 1/3 of the seats
  const videoWidthInSeats = Math.max(
    Math.floor(baseColumnsCount / 3),
    SECTION_VIDEO_MIN_WIDTH_IN_SEATS
  );

  // Keep the 16:9 ratio
  const videoHeightInSeats = Math.ceil(videoWidthInSeats * (9 / 16));

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
