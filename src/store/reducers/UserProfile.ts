import {
  UserProfileActions,
  UserProfileActionTypes,
} from "store/actions/UserProfile";

export type UserProfileState = {
  isUserProfileVisible: boolean;
};

const initialChatState: UserProfileState = {
  isUserProfileVisible: false,
};

export const userProfileReducer = (
  state = initialChatState,
  action: UserProfileActions
): UserProfileState => {
  switch (action.type) {
    case UserProfileActionTypes.SET_USE_PROFILE_MODAL_VISIBILITY:
      const { isVisible: isUserProfileVisible } = action.payload;
      return { ...state, isUserProfileVisible };
    default:
      return state;
  }
};
