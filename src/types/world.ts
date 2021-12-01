import { EntranceStepConfig } from "types/EntranceStep";
import { Question } from "types/Question";
import { UserStatus } from "types/User";

import { Brand } from "utils/types";

export type WorldSlug = Brand<string, "WorldSlug">;

export enum WorldNavTab {
  general = "general",
  entrance = "entrance",
  advanced = "advanced",
}

export interface WorldGeneralFormInput {
  name: string;
  description?: string;
  subtitle?: string;
  bannerImageFile?: FileList;
  bannerImageUrl?: string;
  logoImageFile?: FileList;
  logoImageUrl?: string;
}

export interface WorldEntranceFormInput {
  code: Question[];
  profile: Question[];
  entrance?: EntranceStepConfig[];
  adultContent?: boolean;
  requiresDateOfBirth?: boolean;
}

export interface WorldAdvancedFormInput {
  attendeesTitle?: string;
  showBadges?: boolean;
  showRadio?: boolean;
  radioStation?: string;
  showSchedule?: boolean;
  showUserStatus?: boolean;
  userStatuses?: UserStatus[];
}
