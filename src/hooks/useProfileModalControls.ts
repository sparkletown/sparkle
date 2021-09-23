import { useCallback } from "react";

import { updateUserProfileDataAction } from "store/actions/UserProfile";

import { userProfileSelector } from "utils/selectors";

import { useDispatch } from "./useDispatch";
import { useSelector } from "./useSelector";

export const useProfileModalControls = () => {
  const dispatch = useDispatch();
  const selectedUserId = useSelector(userProfileSelector);

  const hasSelectedProfile = selectedUserId !== undefined;

  const openUserProfileModal = useCallback(
    (userId?: string) => {
      // We can only open the modal when we actually have a userId
      if (!userId) return;

      dispatch(updateUserProfileDataAction(userId));
    },
    [dispatch]
  );

  const closeUserProfileModal = useCallback(() => {
    dispatch(updateUserProfileDataAction(undefined));
  }, [dispatch]);

  return {
    selectedUserId,
    hasSelectedProfile,
    openUserProfileModal,
    closeUserProfileModal,
  };
};
