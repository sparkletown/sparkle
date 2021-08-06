import { ProfileFormData } from "pages/Account/Profile";
import { QuestionsFormData } from "pages/Account/Questions";
import { ProfileLink } from "types/User";
import { propName } from "utils/types";

export const profileModalWideButtonCustomStyle = {
  fontSize: 14,
  width: "100%",
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

export const formProp = (prop: keyof UserProfileModalFormData): string =>
  propName<UserProfileModalFormData>(prop);
