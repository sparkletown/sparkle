import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";

import { setGridData } from "api/profile";

import {
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
  SECTION_VIDEO_MIN_WIDTH_IN_SEATS,
} from "settings";

import { GridPosition } from "types/grid";
import { AuditoriumVenue } from "types/venues";

import {
  convertToCartesianCoordinate,
  getAuditoriumSeatedUsers,
  getSectionCapacity,
} from "utils/auditorium";
import { WithId } from "utils/id";
import {
  currentAuditoriumSectionsSelector,
  currentAuditoriumSectionsByIdSelector,
} from "utils/selectors";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import { useSelector } from "./useSelector";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";
import {
  // useRecentVenueUsers,
  useWorldUsers,
} from "./users";
import { useUser } from "./useUser";
import { GetUserByPostion, useGetUserByPosition } from "./useGetUserByPosition";
import { useShowHide } from "./useShowHide";

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
  useConnectAuditoriumSections(venueId);

  const { userWithId } = useUser();
  const userId = userWithId?.id;

  // const { recentVenueUsers } = useRecentVenueUsers();
  const { worldUsers } = useWorldUsers();

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
    auditoriumUsers: worldUsers,
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

export const useAuditoriumSections = (venue: WithId<AuditoriumVenue>) => {
  const venueId = venue.id;
  useConnectAuditoriumSections(venueId);

  const history = useHistory();

  const {
    isShown: isFullAuditoriumsShown,
    toggle: toggleFullAuditoriums,
  } = useShowHide(true);

  const isFullAuditoriumsHidden = !isFullAuditoriumsShown;

  // const { recentVenueUsers } = useRecentVenueUsers();
  const { worldUsers } = useWorldUsers();

  const sections = useSelector(currentAuditoriumSectionsSelector);

  const enterSection = useCallback(
    (sectionId: string) => {
      history.push(`${history.location.pathname}/section/${sectionId}`);
    },
    [history]
  );

  const notFullSections = useMemo(() => {
    if (!sections) return;

    return sections.filter((section) => {
      const maxUsers = getSectionCapacity(venue, section);
      const seatedUsers = getAuditoriumSeatedUsers({
        auditoriumUsers: worldUsers,
        venueId,
        sectionId: section.id,
      });

      return seatedUsers.length < maxUsers;
    });
  }, [worldUsers, venue, venueId, sections]);

  return useMemo(
    () => ({
      auditoriumSections:
        (isFullAuditoriumsHidden ? notFullSections : sections) ?? [],
      isAuditoriumSectionsLoaded: isLoaded(sections),
      isFullAuditoriumsHidden,
      notFullSections: notFullSections ?? [],
      toggleFullAuditoriums,
      enterSection,
    }),
    [
      sections,
      notFullSections,
      isFullAuditoriumsHidden,
      toggleFullAuditoriums,
      enterSection,
    ]
  );
};

export interface UseAuditoriumGridProps {
  rows: number;
  columns: number;
  getUserBySeat: GetUserByPostion;
  checkIfSeat: (gridData: GridPosition) => boolean;
  takeSeat: (gridData: GridPosition) => Promise<void> | undefined;
}

export const useAuditoriumGrid = ({
  rows,
  columns,
  checkIfSeat,
  getUserBySeat,
  takeSeat,
}: UseAuditoriumGridProps) =>
  useMemo(
    () =>
      Array.from(Array(rows)).map((_, rowIndex) => (
        <div key={rowIndex} className="Section__seats-row">
          {Array.from(Array(columns)).map((_, columnIndex) => {
            const user = getUserBySeat({
              row: rowIndex,
              column: columnIndex,
            });

            if (user) {
              return (
                <UserProfilePicture
                  key={columnIndex}
                  user={user}
                  containerClassName="Section__user-avatar"
                  isAudioEffectDisabled
                />
              );
            }

            const isSeat = checkIfSeat({ row: rowIndex, column: columnIndex });

            if (isSeat) {
              return (
                <div
                  key={columnIndex}
                  className="Section__seat"
                  onClick={() =>
                    takeSeat({ row: rowIndex, column: columnIndex })
                  }
                >
                  +
                </div>
              );
            }

            return <div key={columnIndex} className="Section__empty-circle" />;
          })}
        </div>
      )),
    [rows, columns, checkIfSeat, takeSeat, getUserBySeat]
  );
