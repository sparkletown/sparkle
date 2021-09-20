import { DisplayUser } from "types/chat";

import { WithId } from "utils/id";

export interface AuditoriumSection {
  rowsCount?: number;
  columnsCount?: number;
  seatedUsersSample?: WithId<DisplayUser>[];
  seatedUsersCount?: WithId<DisplayUser>[];
  isVip?: boolean;
}

export enum AuditoriumSize {
  EXTRASMALL = "extra-small",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  EXTRALARGE = "extra-large",
}

export const AuditoriumEmptyBlocksCount: Record<AuditoriumSize, number> = {
  [AuditoriumSize.EXTRASMALL]: 4,
  [AuditoriumSize.SMALL]: 4,
  [AuditoriumSize.MEDIUM]: 2,
  [AuditoriumSize.LARGE]: 2,
  [AuditoriumSize.EXTRALARGE]: 0,
};
