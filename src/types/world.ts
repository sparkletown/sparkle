import { UsernameVisibility } from "types/User";
import { Question } from "types/venues";

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
  code_of_conduct_questions: Question[];
  profile_questions: Question[];
}

export interface WorldAdvancedFormInput {
  attendeesTitle?: string;
  chatTitle?: string;
  showNametags?: UsernameVisibility;
}
