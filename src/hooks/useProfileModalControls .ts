import { useCallback } from "react";

import { User } from "types/User";

import { WithId } from "utils/id";
import { userProfileSelector } from "utils/selectors";

import { setUserProfileData } from "store/actions/UserProfile";

import { useSelector } from "./useSelector";
import { useDispatch } from "./useDispatch";

export const useProfileModalControls = () => {
  const dispatch = useDispatch();
  const selectedUserProfile = useSelector(userProfileSelector);

  const setUserProfile = useCallback(
    (userProfile: WithId<User> | undefined) => {
      dispatch(setUserProfileData(userProfile));
    },
    [dispatch]
  );

  const unsetUserProfile = useCallback(() => {
    dispatch(setUserProfileData(undefined));
  }, [dispatch]);

  return {
    selectedUserProfile,
    setUserProfile,
    unsetUserProfile,
  };
};
