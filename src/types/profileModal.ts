import { omit } from "lodash";

import { ProfileFormData } from "pages/Account/Profile";
import { QuestionsFormData } from "pages/Account/Questions";
import { ProfileLink } from "types/User";

export const profileModalWideButtonCustomStyleGrey = {
  backgroundColor: "#ffffff33",
  fontSize: 14,
  width: "100%",
};

export const profileModalWideButtonCustomStyleDisabled = {
  ...omit(profileModalWideButtonCustomStyleGrey, "backgroundColor"),
  backgroundColor: "#ffffff1a",
};

export const profileModalWideButtonCustomStyle = {
  ...omit(profileModalWideButtonCustomStyleGrey, "backgroundColor"),
};

export interface UserProfileModalFormDataPasswords {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserProfileModalFormData
  extends ProfileFormData,
    UserProfileModalFormDataPasswords,
    QuestionsFormData {
  profileLinks: ProfileLink[];
}
