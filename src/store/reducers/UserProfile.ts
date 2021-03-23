import {
  UserProfileActions,
  UserProfileActionTypes,
} from "store/actions/UserProfile";

import { User } from "types/User";
import { WithId } from "utils/id";

export type UserProfileState = {
  userProfile?: WithId<User>;
};

const initialState: UserProfileState = {
  userProfile: undefined,
};

export const userProfileReducer = (
  state = initialState,
  action: UserProfileActions
): UserProfileState => {
  switch (action.type) {
    case UserProfileActionTypes.UPDATE_USER_PROFILE_DATA:
      const { userProfile } = action.payload;
      return { ...state, userProfile };

    default:
      return state;
  }
};
