import { ReduxAction } from "types/redux";

export enum UserProfileActionTypes {
  UPDATE_USER_PROFILE_ID = "UPDATE_USER_PROFILE_ID",
}

export type UpdateUserProfileDataAction = ReduxAction<
  UserProfileActionTypes.UPDATE_USER_PROFILE_ID,
  { userId?: string }
>;

export const updateUserProfileDataAction = (
  userId?: string
): UpdateUserProfileDataAction => ({
  type: UserProfileActionTypes.UPDATE_USER_PROFILE_ID,
  payload: { userId },
});

export type UserProfileActions = UpdateUserProfileDataAction;
