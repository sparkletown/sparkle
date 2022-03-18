import { SectionId, SpaceId } from "types/id";
import { DisplayUser, GridSeatedUser } from "types/User";

import { WithId } from "utils/id";

export interface AuditoriumSection {
  rowsCount?: number;
  columnsCount?: number;
  seatedUsersSample?: WithId<DisplayUser>[];
  seatedUsersCount?: number;
  isVip?: boolean;
}

export enum AuditoriumSize {
  EXTRASMALL = "extra-small",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  EXTRALARGE = "extra-large",
}

export type AuditoriumSectionPath = {
  venueId: SpaceId;
  sectionId: SectionId;
};

export const AuditoriumEmptyBlocksCount: Record<AuditoriumSize, number> = {
  [AuditoriumSize.EXTRASMALL]: 4,
  [AuditoriumSize.SMALL]: 4,
  [AuditoriumSize.MEDIUM]: 2,
  [AuditoriumSize.LARGE]: 2,
  [AuditoriumSize.EXTRALARGE]: 0,
};
export type AuditoriumSeatedUser = GridSeatedUser & {
  path: AuditoriumSectionPath;
};
