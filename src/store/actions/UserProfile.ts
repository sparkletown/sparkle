import { ElementId, UserId } from "types/id";
import { ReduxAction } from "types/redux";

export enum UserProfileActionTypes {
  UPDATE_USER_PROFILE_ID = "UPDATE_USER_PROFILE_ID",
}

export type UpdateUserProfileDataAction = ReduxAction<
  UserProfileActionTypes.UPDATE_USER_PROFILE_ID,
  { userId?: UserId; elementId?: ElementId }
>;

export const updateUserProfileDataAction = (
  userId?: UserId,
  elementId?: ElementId
): UpdateUserProfileDataAction => ({
  type: UserProfileActionTypes.UPDATE_USER_PROFILE_ID,
  payload: { userId, elementId },
});

export type UserProfileActions = UpdateUserProfileDataAction;
