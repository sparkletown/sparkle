import {
  UserProfileActions,
  UserProfileActionTypes,
} from "store/actions/UserProfile";

import { ElementId, UserId } from "types/id";

export type UserProfileState = {
  userId?: UserId;
  elementId?: ElementId;
};

const initialState: UserProfileState = {
  userId: undefined,
  elementId: undefined,
};

export const userProfileReducer = (
  state = initialState,
  action: UserProfileActions
): UserProfileState => {
  switch (action.type) {
    case UserProfileActionTypes.UPDATE_USER_PROFILE_ID:
      const { userId, elementId } = action.payload;
      return { userId, elementId };

    default:
      return state;
  }
};
