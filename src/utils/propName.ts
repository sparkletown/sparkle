import { UserProfileModalFormData } from "types/profileModal";

// @debt check if Lodash doesn't already do this, and if it does, remove this function
export const propName = <TObj>(name: keyof TObj) => name;

// @debt check if Lodash doesn't already do this, and if it does, remove this function
export const userProfileModalFormProp = (
  prop: keyof UserProfileModalFormData
): string => propName<UserProfileModalFormData>(prop);
