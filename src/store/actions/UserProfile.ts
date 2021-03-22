import { User } from "types/User";
import { WithId } from "utils/id";
export const UPDATE_USER_PROFILE_DATA: string = "UPDATE_USER_PROFILE_DATA";

interface UpdateProfileDataAction {
  type: typeof UPDATE_USER_PROFILE_DATA;
  payload?: WithId<User>;
}

export const updateUserProfileData = (userProfile?: WithId<User>) => ({
  type: UPDATE_USER_PROFILE_DATA,
  payload: userProfile,
});

export type UserProfileActions = UpdateProfileDataAction;
