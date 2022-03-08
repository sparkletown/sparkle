import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";

import { STRING_NEWLINE } from "settings";

import { SpaceWithId, UserId } from "types/id";

import { generateAttendeeSpaceLandingUrl } from "utils/url";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useProfileById } from "hooks/user/useProfileById";
import { useShowHide } from "hooks/useShowHide";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { Loading } from "components/molecules/Loading";

import { EditingProfileModalContent } from "../EditingProfileModalContent";
import { ProfileModalContent } from "../ProfileModalContent";

interface NewProfileModalBodyProps {
  userId?: UserId;
  space?: SpaceWithId;
  closeUserProfileModal: () => void;
}

export const NewProfileModalBody: React.FC<NewProfileModalBodyProps> = ({
  userId,
  space,
  closeUserProfileModal,
}) => {
  const { profile, isLoading } = useProfileById({ userId });
  const spaceSlug = space?.slug;
  const { worldSlug } = useWorldParams();
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

    history.push(generateAttendeeSpaceLandingUrl(worldSlug, spaceSlug));
  }, [closeUserProfileModal, history, worldSlug, spaceSlug]);

  const { selectRecipientChat } = useChatSidebarControls();

  const openChosenUserChat = useCallback(() => {
    if (profile) {
      selectRecipientChat(profile);
    }
    closeUserProfileModal();
  }, [selectRecipientChat, profile, closeUserProfileModal]);

  if (isLoading) {
    return <Loading />;
  }

  if (!profile) {
    return (
      <div className="ProfileModalFetchUser">
        <div>
          Oops, an error occurred while trying to load user data.
          {STRING_NEWLINE}
          Please contact our support team.
        </div>
      </div>
    );
  }

  if (!isCurrentUser) {
    return (
      <ProfileModalContent
        space={space}
        user={profile}
        onPrimaryButtonClick={openChosenUserChat}
      />
    );
  }

  if (editMode) {
    return (
      <EditingProfileModalContent
        space={space}
        user={profile}
        onCancelEditing={turnOffEditMode}
      />
    );
  }

  return (
    <ProfileModalContent
      space={space}
      user={profile}
      onPrimaryButtonClick={logout}
      onEditMode={turnOnEditMode}
    />
  );
};
