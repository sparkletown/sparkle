import { omit } from "lodash";

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

export const profileModalPasswordsFields: (keyof UserProfileModalFormDataPasswords)[] =
  ["oldPassword", "newPassword", "confirmNewPassword"];

export interface UserProfileModalFormData
  extends UserProfileModalFormDataPasswords {
  partyName: string;
  pictureUrl: string;
  profileLinks: ProfileLink[];
}
