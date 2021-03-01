import { useCallback } from "react";

import { userProfileSelector } from "utils/selectors";

import { setUserProfileData } from "store/actions/UserProfile";

import { useSelector } from "./useSelector";
import { useDispatch } from "./useDispatch";
import { User } from "types/User";
import { WithId } from "utils/id";

export const useProfileModal = () => {
  const dispatch = useDispatch();
  const selectedUserProfile = useSelector(userProfileSelector);

  const setUserProfile = useCallback(
    (userProfile: WithId<User> | undefined) => {
      dispatch(setUserProfileData(userProfile));
    },
    [dispatch]
  );

  return {
    selectedUserProfile,
    setUserProfile,
  };
};
