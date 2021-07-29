import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";

import { WithId } from "utils/id";

import { AnyVenue } from "types/venues";

import { ProfileModalContent } from "./ProfileModalContent";

import { useChatSidebarControls } from "hooks/chatSidebar";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import "./ProfileModal.scss";

export interface UserProfileModalProps {
  venue: WithId<AnyVenue>;
}

export const ProfileModal: React.FC<UserProfileModalProps> = ({ venue }) => {
  const { selectRecipientChat } = useChatSidebarControls();

  const {
    selectedUserProfile,
    hasSelectedProfile,
    closeUserProfileModal,
  } = useProfileModalControls();

  const chosenUserId = selectedUserProfile?.id;

  const openChosenUserChat = useCallback(() => {
    if (!chosenUserId) return;

    selectRecipientChat(chosenUserId);
    closeUserProfileModal();
  }, [selectRecipientChat, closeUserProfileModal, chosenUserId]);

  if (!selectedUserProfile || !chosenUserId) {
    return null;
  }

  return (
    <Modal
      className="UserProfileModal"
      show={hasSelectedProfile}
      onHide={closeUserProfileModal}
    >
      <Modal.Body className="UserProfileModal__body">
        <ProfileModalContent
          chosenUser={selectedUserProfile}
          openChat={openChosenUserChat}
          venue={venue}
        />
      </Modal.Body>
    </Modal>
  );
};
