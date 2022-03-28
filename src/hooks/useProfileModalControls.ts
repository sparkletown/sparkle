import { useCallback } from "react";

import { updateUserProfileDataAction } from "store/actions/UserProfile";

import { ElementId, UserId } from "types/id";

import { userProfileSelector } from "utils/selectors";
import { isDefined } from "utils/types";

import { useDispatch } from "./useDispatch";
import { useSelector } from "./useSelector";

export const useProfileModalControls = () => {
  const dispatch = useDispatch();
  const { userId: selectedUserId, elementId: selectedElementId } = useSelector(
    userProfileSelector
  );

  const hasSelectedProfile = isDefined(selectedUserId);

  const openUserProfileModal = useCallback(
    (userId?: UserId, elementId?: ElementId) =>
      userId && dispatch(updateUserProfileDataAction(userId, elementId)),
    [dispatch]
  );

  const closeUserProfileModal = useCallback(
    () => dispatch(updateUserProfileDataAction(undefined)),
    [dispatch]
  );

  return {
    selectedUserId,
    selectedElementId,
    hasSelectedProfile,
    openUserProfileModal,
    closeUserProfileModal,
  };
};
