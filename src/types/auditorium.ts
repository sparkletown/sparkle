import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

export interface AuditoriumSection {
  seatedUsersSample?: WithId<DisplayUser>[];
  seatedUsersCount?: number;
  isVip?: boolean;
}

export type AuditoriumSectionPath = {
  venueId: string;
  sectionId: string;
};
