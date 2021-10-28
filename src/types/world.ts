import { EntranceStepConfig } from "types/EntranceStep";
import { Question } from "types/Question";
import { UsernameVisibility, UserStatus } from "types/User";

export enum WorldNavTab {
  start = "start",
  entrance = "entrance",
  advanced = "advanced",
}

export interface WorldStartFormInput {
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
  chatTitle?: string;
  showBadges?: boolean;
  showNametags?: UsernameVisibility;
  showSchedule?: boolean;
  showUserStatus?: boolean;
  userStatuses?: UserStatus[];
}
