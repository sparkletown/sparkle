import React, { useCallback } from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

import { User } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { venueLandingUrl } from "utils/url";

import { useChatSidebarControls } from "hooks/chats/useChatSidebarControls";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useShowHide } from "hooks/useShowHide";

import { EditingProfileModalContent } from "../EditingProfileModalContent";
import { ProfileModalContent } from "../ProfileModalContent";

export interface NewProfileModalBodyProps {
  user: WithId<User>;
  venue: WithId<AnyVenue>;
  closeUserProfileModal: () => void;
}

export const NewProfileModalBody: React.FC<NewProfileModalBodyProps> = ({
  user,
  venue,
  closeUserProfileModal,
}: NewProfileModalBodyProps) => {
  const firebase = useFirebase();
  const history = useHistory();

  const isCurrentUser = useIsCurrentUser(user.id);

  const {
    isShown: editMode,
    show: turnOnEditMode,
    hide: turnOffEditMode,
  } = useShowHide();

  const logout = useCallback(async () => {
    await firebase.auth().signOut();
    closeUserProfileModal();

    history.push(venue.id ? venueLandingUrl(venue.id) : "/");
  }, [closeUserProfileModal, firebase, history, venue.id]);

  const { selectRecipientChat } = useChatSidebarControls();

  const openChosenUserChat = useCallback(() => {
    selectRecipientChat(user);
    closeUserProfileModal();
  }, [selectRecipientChat, user, closeUserProfileModal]);

  return isCurrentUser ? (
    editMode ? (
      <EditingProfileModalContent
        user={user}
        venue={venue}
        onCancelEditing={turnOffEditMode}
      />
    ) : (
      <ProfileModalContent
        venue={venue}
        user={user}
        onPrimaryButtonClick={logout}
        onEditMode={turnOnEditMode}
      />
    )
  ) : (
    <ProfileModalContent
      venue={venue}
      user={user}
      onPrimaryButtonClick={openChosenUserChat}
    />
  );
};
