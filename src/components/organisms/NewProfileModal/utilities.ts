import { UserProfileModalFormData } from "components/organisms/NewProfileModal/UserProfileModal/UserProfileModalContent";
import { propName } from "utils/types";

export const profileModalWideButtonCustomStyle = {
  fontSize: 14,
  width: "100%",
};

export const formProp = (prop: keyof UserProfileModalFormData): string =>
  propName<UserProfileModalFormData>(prop);
