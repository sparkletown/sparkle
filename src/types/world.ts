import { EntranceStepConfig } from "types/EntranceStep";
import { Question } from "types/Question";
import { UserStatus } from "types/User";

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
  hasSocialLoginEnabled?: boolean;
}

export interface WorldScheduleFormInput {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface WorldScheduleSettings {
  startTimeUnix?: number;
  endTimeUnix?: number;
}
