import { useCallback } from "react";

import { updateUserProfileDataAction } from "store/actions/UserProfile";

import { User } from "types/User";

import { WithId } from "utils/id";
import { userProfileSelector } from "utils/selectors";

import { useDispatch } from "./useDispatch";
import { useSelector } from "./useSelector";

export const useProfileModalControls = () => {
  const dispatch = useDispatch();
  const selectedUserProfile = useSelector(userProfileSelector);

  const hasSelectedProfile = selectedUserProfile !== undefined;

  const updateUserProfileData = useCallback(
    (userProfile?: WithId<User>) =>
      dispatch(updateUserProfileDataAction(userProfile)),
    [dispatch]
  );

  const openUserProfileModal = useCallback(
    (userProfile?: WithId<User>) => {
      // We can only open the modal when we actually have a userProfile
      if (!userProfile) return;

      updateUserProfileData(userProfile);
    },
    [updateUserProfileData]
  );

  const closeUserProfileModal = useCallback(() => {
    dispatch(updateUserProfileDataAction(undefined));
  }, [dispatch]);

  return {
    selectedUserProfile,
    hasSelectedProfile,
    openUserProfileModal,
    closeUserProfileModal,
    updateUserProfileData,
  };
};
