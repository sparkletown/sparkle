import { UserId } from "types/id";
import { ReduxAction } from "types/redux";

export enum UserProfileActionTypes {
  UPDATE_USER_PROFILE_ID = "UPDATE_USER_PROFILE_ID",
}

export type UpdateUserProfileDataAction = ReduxAction<
  UserProfileActionTypes.UPDATE_USER_PROFILE_ID,
  { userId?: UserId }
>;

export const updateUserProfileDataAction = (
  userId?: UserId
): UpdateUserProfileDataAction => ({
  type: UserProfileActionTypes.UPDATE_USER_PROFILE_ID,
  payload: { userId },
});

export type UserProfileActions = UpdateUserProfileDataAction;
