import {
  UserProfileActions,
  UPDATE_USER_PROFILE_DATA,
} from "../actions/UserProfile";

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
    case UPDATE_USER_PROFILE_DATA:
      return { ...state, userProfile: action.payload };
    default:
      return state;
  }
};
