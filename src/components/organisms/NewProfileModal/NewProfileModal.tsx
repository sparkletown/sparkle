import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { OnSubmit } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

import { PROFILE_MODAL_EDIT_MODE_TURNING_OFF_DELAY } from "settings";

import { UserProfileModalFormData } from "types/profileModal";
import { User } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { venueLandingUrl } from "utils/url";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useShowHide } from "hooks/useShowHide";

import { ProfileModalUserLoading } from "components/organisms/NewProfileModal/components/ProfileModalUserLoading";
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
    selectedUserId,
    hasSelectedProfile,
    closeUserProfileModal,
  } = useProfileModalControls();

  const isCurrentUser = useIsCurrentUser(selectedUserId);

  const openChosenUserChat = useCallback(() => {
    if (!selectedUserId) return;

    selectRecipientChat(selectedUserId);
    closeUserProfileModal();
  }, [selectedUserId, selectRecipientChat, closeUserProfileModal]);

  const logout = useCallback(async () => {
    await firebase.auth().signOut();

    history.push(venue.id ? venueLandingUrl(venue.id) : "/");
  }, [firebase, history, venue.id]);

  const hideHandler = useCallback(async () => {
    if (isSubmitting) return;

    closeUserProfileModal();
    setTimeout(
      () => turnOffEditMode(),
      PROFILE_MODAL_EDIT_MODE_TURNING_OFF_DELAY
    );
  }, [closeUserProfileModal, isSubmitting, turnOffEditMode]);

  const renderBody = useCallback(
    (user: WithId<User>, refreshUser: () => void) => {
      const handleSubmitWrapper: (
        inner: OnSubmit<UserProfileModalFormData>
      ) => OnSubmit<UserProfileModalFormData> = (
        inner: OnSubmit<UserProfileModalFormData>
      ) => async (data) => {
        startSubmitting();
        try {
          await inner(data);
          refreshUser();
        } finally {
          stopSubmitting();
        }
      };

      return isCurrentUser ? (
        editMode ? (
          <EditingProfileModalContent
            user={user}
            venue={venue}
            onCancelEditing={turnOffEditMode}
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
    },
    [
      editMode,
      isCurrentUser,
      logout,
      openChosenUserChat,
      startSubmitting,
      stopSubmitting,
      turnOffEditMode,
      turnOnEditMode,
      venue,
    ]
  );

  return (
    <Modal
      className="ProfileModal"
      show={hasSelectedProfile}
      onHide={hideHandler}
    >
      <Modal.Body className="ProfileModal__body">
        <ProfileModalUserLoading userId={selectedUserId} render={renderBody} />
      </Modal.Body>
    </Modal>
  );
};
