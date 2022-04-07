import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";

import { ATTENDEE_LANDING_URL, STRING_NEWLINE } from "settings";

import { UserId, UserWithId } from "types/id";

import { generateUrl } from "utils/url";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useShowHide } from "hooks/useShowHide";

import { EditingProfileModalContent } from "../EditingProfileModalContent";
import { ProfileModalContent } from "../ProfileModalContent";

export interface UserProfileModalBodyProps {
  userId?: UserId;
  profile: UserWithId;
  closeUserProfileModal: () => void;
}

export const UserProfileModalBody: React.FC<UserProfileModalBodyProps> = ({
  userId,
  profile,
  closeUserProfileModal,
}) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const history = useHistory();
  const isCurrentUser = useIsCurrentUser(userId);

  const {
    isShown: editMode,
    show: turnOnEditMode,
    hide: turnOffEditMode,
  } = useShowHide();

  const logout = useCallback(async () => {
    await firebase.auth().signOut();
    closeUserProfileModal();

    history.push(
      generateUrl({
        route: ATTENDEE_LANDING_URL,
        required: ["worldSlug", "spaceSlug"],
        params: { worldSlug, spaceSlug },
      })
    );
  }, [closeUserProfileModal, history, worldSlug, spaceSlug]);

  const { selectRecipientChat } = useChatSidebarControls();

  const openChosenUserChat = useCallback(() => {
    selectRecipientChat(profile);
    closeUserProfileModal();
  }, [selectRecipientChat, profile, closeUserProfileModal]);

  if (!profile) {
    return (
      <div data-bem="UserProfileModalBody--fetch-user">
        <div>
          Oops, an error occurred while trying to load user data.
          {STRING_NEWLINE}
          Please contact our support team.
        </div>
      </div>
    );
  }

  if (isCurrentUser && editMode) {
    return (
      <EditingProfileModalContent
        user={profile}
        onCancelEditing={turnOffEditMode}
      />
    );
  }

  if (isCurrentUser && !editMode)
    return (
      <ProfileModalContent
        user={profile}
        onPrimaryButtonClick={logout}
        onEditMode={turnOnEditMode}
        onModalClose={closeUserProfileModal}
      />
    );

  return (
    <ProfileModalContent
      user={profile}
      onPrimaryButtonClick={openChosenUserChat}
      onModalClose={closeUserProfileModal}
    />
  );
};
