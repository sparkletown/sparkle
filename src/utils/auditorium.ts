import { DEFAULT_AUDITORIUM_SECTION_CAPACITY } from "settings";

import { AuditoriumSection } from "types/auditorium";
import { AuditoriumVenue } from "types/venues";
import { AuditoriumSize } from "types/auditorium";
import { User } from "types/User";

import { WithId } from "./id";

const emptyFilteredUsers: never[] = [];

export interface ConvertCoordinateProps {
  index: number;
  totalAmount: number;
}

export const convertToCartesianCoordinate = ({
  index,
  totalAmount,
}: ConvertCoordinateProps) => index - Math.floor(totalAmount / 2);

export const chooseAuditoriumSize = (sectionsCount: number) => {
  if (sectionsCount <= 4) return AuditoriumSize.SMALL;

  if (sectionsCount > 4 && sectionsCount <= 10) {
    return AuditoriumSize.MEDIUM;
  }

  return AuditoriumSize.LARGE;
};

export const getSectionCapacity = (
  venue: AuditoriumVenue,
  section: AuditoriumSection
) =>
  section.capacity ??
  venue.sectionCapacity ??
  DEFAULT_AUDITORIUM_SECTION_CAPACITY;

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
    ? // ? auditoriumUsers.filter(
      //     (user) => user.data?.[venueId]?.sectionId === sectionId
      //   )
      auditoriumUsers
    : emptyFilteredUsers;
