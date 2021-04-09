import { ReduxAction } from "types/redux";

import { User } from "types/User";
import { WithId } from "utils/id";

export enum UserProfileActionTypes {
  UPDATE_USER_PROFILE_DATA = "UPDATE_USER_PROFILE_DATA",
}

export type UpdateUserProfileDataAction = ReduxAction<
  UserProfileActionTypes.UPDATE_USER_PROFILE_DATA,
  { userProfile?: WithId<User> }
>;

export const updateUserProfileData = (
  userProfile?: WithId<User>
): UpdateUserProfileDataAction => ({
  type: UserProfileActionTypes.UPDATE_USER_PROFILE_DATA,
  payload: { userProfile },
});

export type UserProfileActions = UpdateUserProfileDataAction;
