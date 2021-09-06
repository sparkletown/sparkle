import {
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
  SECTION_VIDEO_MIN_WIDTH_IN_SEATS,
} from "settings";

import { AuditoriumSection, AuditoriumSize } from "types/auditorium";
import { User } from "types/User";
import { AuditoriumVenue } from "types/venues";

import { WithId } from "./id";

const emptyFilteredUsers: WithId<User>[] = [];

export interface ConvertCoordinateProps {
  index: number;
  totalAmount: number;
}

export const convertToCartesianCoordinate = ({
  index,
  totalAmount,
}: ConvertCoordinateProps) => index - Math.floor(totalAmount / 2);

export const chooseAuditoriumSize = (sectionsCount: number) => {
  if (sectionsCount <= 4) return AuditoriumSize.EXTRASMALL;

  if (sectionsCount > 4 && sectionsCount <= 6) return AuditoriumSize.SMALL;

  if (sectionsCount > 6 && sectionsCount <= 8) return AuditoriumSize.MEDIUM;

  if (sectionsCount > 8 && sectionsCount <= 14) return AuditoriumSize.LARGE;

  return AuditoriumSize.EXTRALARGE;
};

export const getVideoSizeInSeats = (columnCount: number) => {
  // Video takes 1/3 of the seats
  const videoWidthInSeats = Math.max(
    Math.floor(columnCount / 3),
    SECTION_VIDEO_MIN_WIDTH_IN_SEATS
  );

  // Keep the 16:9 ratio
  const videoHeightInSeats = Math.ceil(videoWidthInSeats * (9 / 16));

  return {
    videoHeightInSeats,
    videoWidthInSeats,
  };
};

export const getSectionCapacity = (
  venue: AuditoriumVenue,
  section: AuditoriumSection
) => {
  const baseColumnsCount =
    section.columnsCount ??
    venue.auditoriumColumns ??
    SECTION_DEFAULT_COLUMNS_COUNT;

  // -1 to compensate for possible incorrect precision of the video size calculations
  const baseRowsCount =
    (section.rowsCount ?? venue.auditoriumRows ?? SECTION_DEFAULT_ROWS_COUNT) -
    1;

  const { videoWidthInSeats, videoHeightInSeats } = getVideoSizeInSeats(
    baseColumnsCount
  );

  const notValidSeats = videoHeightInSeats * videoWidthInSeats;

  const generalSeatsCount = baseColumnsCount * baseRowsCount;

  return generalSeatsCount - notValidSeats;
};

export interface GetSeatedUsersProps {
  auditoriumUsers: readonly WithId<User>[];
  venueId?: string;
  sectionId?: string;
}

export const getAuditoriumSeatedUsers = ({
  auditoriumUsers,
  venueId,
  sectionId,
}: GetSeatedUsersProps) =>
  venueId && sectionId
    ? auditoriumUsers.filter(
        (user) => user.data?.[venueId]?.sectionId === sectionId
      )
    : emptyFilteredUsers;
