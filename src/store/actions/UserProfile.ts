import { ReduxAction } from "types/redux";

import { User } from "types/User";
import { WithId } from "utils/id";

export enum UserProfileActionTypes {
  SET_USER_PROFILE_DATA = "SET_USER_PROFILE_DATA",
}

export type SetUseProfileDataAction = ReduxAction<
  UserProfileActionTypes.SET_USER_PROFILE_DATA,
  { userProfile?: WithId<User> }
>;

export const setUserProfileData = (
  userProfile?: WithId<User>
): SetUseProfileDataAction => ({
  type: UserProfileActionTypes.SET_USER_PROFILE_DATA,
  payload: { userProfile },
});

export type UserProfileActions = SetUseProfileDataAction;
