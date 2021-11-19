import { EntranceStepConfig } from "types/EntranceStep";
import { Question } from "types/Question";
import { UserStatus } from "types/User";

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
  showBadges?: boolean;
  showRadio?: boolean;
  radioStation?: string;
  showSchedule?: boolean;
  showUserStatus?: boolean;
  userStatuses?: UserStatus[];
}
