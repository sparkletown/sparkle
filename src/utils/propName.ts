import { UserProfileModalFormData } from "types/profileModal";

export const propName = <TObj>(name: keyof TObj) => name;

export const userProfileModalFormProp = (
  prop: keyof UserProfileModalFormData
): string => propName<UserProfileModalFormData>(prop);
