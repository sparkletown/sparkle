import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { OnSubmit } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

import { IS_BURN } from "secrets";

import { PROFILE_MODAL_EDIT_MODE_TURNING_OFF_DELAY } from "settings";

import { UserProfileModalFormData } from "types/profileModal";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { venueLandingUrl } from "utils/url";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useShowHide } from "hooks/useShowHide";

import { EditingProfileModalContent } from "components/organisms/NewProfileModal/EditingProfileModalContent";
import { ProfileModalContent } from "components/organisms/NewProfileModal/ProfileModalContent";

import "./NewProfileModal.scss";

interface NewProfileModalProps {
  venue: WithId<AnyVenue>;
}

export const NewProfileModal: React.FC<NewProfileModalProps> = ({ venue }) => {
  const { selectRecipientChat } = useChatSidebarControls();

  const firebase = useFirebase();
  const history = useHistory();

  const {
    isShown: editMode,
    show: turnOnEditMode,
    hide: turnOffEditMode,
  } = useShowHide();

  const {
    isShown: isSubmitting,
    show: startSubmitting,
    hide: stopSubmitting,
  } = useShowHide();

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

  const logout = useCallback(async () => {
    await firebase.auth().signOut();

    history.push(
      //@debt seems like a legacy logic
      IS_BURN ? "/enter" : venue.id ? venueLandingUrl(venue.id) : "/"
    );
  }, [firebase, history, venue.id]);

  const hideHandler = useCallback(async () => {
    if (isSubmitting) return;

    closeUserProfileModal();
    setTimeout(
      () => turnOffEditMode(),
      PROFILE_MODAL_EDIT_MODE_TURNING_OFF_DELAY
    );
  }, [closeUserProfileModal, isSubmitting, turnOffEditMode]);

  const handleSubmitWrapper: (
    inner: OnSubmit<UserProfileModalFormData>
  ) => OnSubmit<UserProfileModalFormData> = (
    inner: OnSubmit<UserProfileModalFormData>
  ) => async (data) => {
    startSubmitting();
    try {
      await inner(data);
    } finally {
      stopSubmitting();
    }
  };

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
                <EditingProfileModalContent
                  user={selectedUserProfile}
                  venue={venue}
                  onCancelEditing={turnOffEditMode}
                  handleSubmitWrapper={handleSubmitWrapper}
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
