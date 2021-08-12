import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import { ProfileModalContent } from "components/organisms/NewProfileModal/ProfileModal/ProfileModalContent";

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

  const openChosenUserChat = useCallback(() => {
    if (!selectedUserProfile?.id) return;

    selectRecipientChat(selectedUserProfile?.id);
    closeUserProfileModal();
  }, [selectRecipientChat, closeUserProfileModal, selectedUserProfile?.id]);

  return (
    <Modal
      className="ProfileModal"
      show={hasSelectedProfile}
      onHide={closeUserProfileModal}
    >
      <Modal.Body className="ProfileModal__body">
        {selectedUserProfile?.id && (
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
