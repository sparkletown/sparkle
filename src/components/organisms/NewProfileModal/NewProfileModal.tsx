import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

import { IS_BURN } from "secrets";

import { PROFILE_MODAL_EDIT_MODE_TURNING_OFF_DELAY } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { venueLandingUrl } from "utils/url";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useShowHide } from "hooks/useShowHide";

import { CurrentUserProfileModalContent } from "components/organisms/NewProfileModal/CurrentUserProfileModalContent";
import { ProfileModalContent } from "components/organisms/NewProfileModal/ProfileModalContent";

import "./NewProfileModal.scss";

export interface UserProfileModalProps {
  venue: WithId<AnyVenue>;
}

export const NewProfileModal: React.FC<UserProfileModalProps> = ({ venue }) => {
  const { selectRecipientChat } = useChatSidebarControls();

  const {
    isShown: editMode,
    show: turnOnEditMode,
    hide: turnOffEditMode,
  } = useShowHide(false);

  const {
    selectedUserProfile,
    hasSelectedProfile,
    closeUserProfileModal,
  } = useProfileModalControls();

  const isSameUser = useIsCurrentUser(selectedUserProfile);

  const openChosenUserChat = useCallback(() => {
    if (!selectedUserProfile?.id) return;

    selectRecipientChat(selectedUserProfile?.id);
    closeUserProfileModal();
  }, [selectRecipientChat, closeUserProfileModal, selectedUserProfile?.id]);

  const firebase = useFirebase();
  const history = useHistory();

  const isSubmittingState = useShowHide(false);
  const { isShown: isSubmitting } = isSubmittingState;

  const logout = useCallback(async () => {
    await firebase.auth().signOut();

    history.push(
      //@debt seems like a legacy logic
      IS_BURN ? "/enter" : venue.id ? venueLandingUrl(venue.id) : "/"
    );
  }, [firebase, history, venue.id]);

  const hideHandler = useCallback(() => {
    if (isSubmitting) return;

    closeUserProfileModal();
    setTimeout(
      () => turnOffEditMode(),
      PROFILE_MODAL_EDIT_MODE_TURNING_OFF_DELAY
    );
  }, [closeUserProfileModal, isSubmitting, turnOffEditMode]);

  return (
    <Modal
      className="ProfileModal"
      show={hasSelectedProfile}
      onHide={hideHandler}
    >
      <Modal.Body className="ProfileModal__body">
        {isSameUser
          ? editMode
            ? selectedUserProfile && (
                <CurrentUserProfileModalContent
                  user={selectedUserProfile}
                  venue={venue}
                  onCancelEditing={turnOffEditMode}
                  isSubmittingState={isSubmittingState}
                />
              )
            : selectedUserProfile && (
                <ProfileModalContent
                  venue={venue}
                  user={selectedUserProfile}
                  onPrimaryButtonClick={logout}
                  onEditMode={turnOnEditMode}
                />
              )
          : selectedUserProfile && (
              <ProfileModalContent
                venue={venue}
                user={selectedUserProfile}
                onPrimaryButtonClick={openChosenUserChat}
              />
            )}
      </Modal.Body>
    </Modal>
  );
};
