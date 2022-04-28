import { useCallback } from "react";

import { userProfileSelector } from "utils/selectors";

import { useDispatch } from "hooks/useDispatch";
import { useSelector } from "hooks/useSelector";

import { updateUserProfileDataAction } from "../AnimateMapActionTypes";
import { ElementId, UserId } from "../AnimateMapIds";
import { isDefined } from "../utils";

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
