import {
  UserProfileActions,
  UserProfileActionTypes,
} from "store/actions/UserProfile";
import { User } from "types/User";
import { WithId } from "utils/id";

export type UserProfileState = {
  userProfile: WithId<User> | undefined;
};

const initialChatState: UserProfileState = {
  userProfile: undefined,
};

export const userProfileReducer = (
  state = initialChatState,
  action: UserProfileActions
): UserProfileState => {
  switch (action.type) {
    case UserProfileActionTypes.SET_USER_PROFILE_DATA:
      const { userProfile } = action.payload;
      return { ...state, userProfile };
    default:
      return state;
  }
};
