import { ProfileLink } from "types/User";

export interface UserProfileModalFormDataPasswords {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserProfileModalFormData
  extends UserProfileModalFormDataPasswords {
  partyName: string;
  pictureUrl: string;
  profileLinks: ProfileLink[];
  micSource?: string;
  speakerSource?: string;
  videoSource?: string;
}
