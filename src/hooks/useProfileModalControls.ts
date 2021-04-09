import { useCallback } from "react";

import { User } from "types/User";

import { WithId } from "utils/id";
import { userProfileSelector } from "utils/selectors";

import { updateUserProfileData } from "store/actions/UserProfile";

import { useSelector } from "./useSelector";
import { useDispatch } from "./useDispatch";

export const useProfileModalControls = () => {
  const dispatch = useDispatch();
  const selectedUserProfile = useSelector(userProfileSelector);

  const hasSelectedProfile = selectedUserProfile !== undefined;

  const openUserProfileModal = useCallback(
    (userProfile?: WithId<User>) => {
      // We can only open the modal when we actually have a userProfile
      if (!userProfile) return;

      dispatch(updateUserProfileData(userProfile));
    },
    [dispatch]
  );

  const closeUserProfileModal = useCallback(() => {
    dispatch(updateUserProfileData(undefined));
  }, [dispatch]);

  return {
    selectedUserProfile,
    hasSelectedProfile,
    openUserProfileModal,
    closeUserProfileModal,
  };
};
