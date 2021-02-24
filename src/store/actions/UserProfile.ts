import { ReduxAction } from "types/redux";

export enum UserProfileActionTypes {
  SET_USE_PROFILE_MODAL_VISIBILITY = "SET_USE_PROFILE_MODAL_VISIBILITY",
}

export type SetUseProfileModalVisibilityAction = ReduxAction<
  UserProfileActionTypes.SET_USE_PROFILE_MODAL_VISIBILITY,
  { isVisible: boolean }
>;

export const setUserProfileModalVisibility = (
  isVisible: boolean
): SetUseProfileModalVisibilityAction => ({
  type: UserProfileActionTypes.SET_USE_PROFILE_MODAL_VISIBILITY,
  payload: { isVisible },
});

export type UserProfileActions = SetUseProfileModalVisibilityAction;
