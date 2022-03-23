import { useCallback } from "react";

import { updateUserProfileDataAction } from "store/actions/UserProfile";

import { UserId } from "types/id";

import { userProfileSelector } from "utils/selectors";
import { isDefined } from "utils/types";

import { useDispatch } from "./useDispatch";
import { useSelector } from "./useSelector";

export const useProfileModalControls = () => {
  const dispatch = useDispatch();
  const selectedUserId = useSelector(userProfileSelector);

  const hasSelectedProfile = isDefined(selectedUserId);

  const openUserProfileModal = useCallback(
    (userId?: UserId) =>
      userId && dispatch(updateUserProfileDataAction(userId)),
    [dispatch]
  );

  const closeUserProfileModal = useCallback(
    () => dispatch(updateUserProfileDataAction(undefined)),
    [dispatch]
  );

  return {
    selectedUserId,
    hasSelectedProfile,
    openUserProfileModal,
    closeUserProfileModal,
  };
};
