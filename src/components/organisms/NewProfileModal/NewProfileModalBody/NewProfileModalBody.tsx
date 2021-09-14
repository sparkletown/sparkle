import React, { useCallback } from "react";
import { OnSubmit } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

import { UserProfileModalFormData } from "types/profileModal";
import { User } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { venueLandingUrl } from "utils/url";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useShowHide } from "hooks/useShowHide";

import { EditingProfileModalContent } from "../EditingProfileModalContent";
import { ProfileModalContent } from "../ProfileModalContent";

import "./NewProfileModalBody.scss";

export interface NewProfileModalBodyProps {
  user: WithId<User>;
  venue: WithId<AnyVenue>;
  refreshUser: () => Promise<void>;
  submitState: ReturnType<typeof useShowHide>;
  closeUserProfileModal: () => void;
}

export const NewProfileModalBody: React.FC<NewProfileModalBodyProps> = ({
  user,
  venue,
  refreshUser,
  submitState,
  closeUserProfileModal,
}: NewProfileModalBodyProps) => {
  const firebase = useFirebase();
  const history = useHistory();

  const isCurrentUser = useIsCurrentUser(user.id);

  const {
    isShown: isSubmitting,
    show: startSubmitting,
    hide: stopSubmitting,
  } = submitState;

  const {
    isShown: editMode,
    show: turnOnEditMode,
    hide: turnOffEditMode,
  } = useShowHide();

  const logout = useCallback(async () => {
    await firebase.auth().signOut();

    history.push(venue.id ? venueLandingUrl(venue.id) : "/");
  }, [firebase, history, venue.id]);

  const { selectRecipientChat } = useChatSidebarControls();

  const openChosenUserChat = useCallback(() => {
    selectRecipientChat(user.id);
    closeUserProfileModal();
  }, [user.id, selectRecipientChat, closeUserProfileModal]);

  const handleSubmitWrapper: (
    inner: OnSubmit<UserProfileModalFormData>
  ) => OnSubmit<UserProfileModalFormData> = useCallback(
    (inner: OnSubmit<UserProfileModalFormData>) => async (data) => {
      startSubmitting();
      try {
        await inner(data);
        await refreshUser();
        turnOffEditMode();
      } finally {
        stopSubmitting();
      }
    },
    [refreshUser, startSubmitting, stopSubmitting, turnOffEditMode]
  );

  return isCurrentUser ? (
    editMode ? (
      <EditingProfileModalContent
        user={user}
        venue={venue}
        onCancelEditing={turnOffEditMode}
        isSubmitting={isSubmitting}
        handleSubmitWrapper={handleSubmitWrapper}
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
