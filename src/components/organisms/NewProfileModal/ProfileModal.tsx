import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { WithId } from "utils/id";
import { AnyVenue } from "types/venues";
import { useChatSidebarControls } from "hooks/chatSidebar";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { ProfileModalContentBasicInfo } from "./ProfileModalBasicInfo/ProfileModalContentBasicInfo";
import { ProfileModalQuestions } from "./ProfileModalQuestions/ProfileModalQuestions";
import { ProfileModalLinks } from "./ProfileModalLinks/ProfileModalLinks";
import { ProfileModalBadges } from "./ProfileModalBadges/ProfileModalBadges";
import { ProfileModalForeignUserButtons } from "./ProfileModalButtons/ProfileModalForeignUserButtons";

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

  if (!selectedUserProfile || !selectedUserProfile?.id) {
    return null;
  }

  return (
    <Modal
      className="ProfileModal"
      show={hasSelectedProfile}
      onHide={closeUserProfileModal}
    >
      <Modal.Body className="ProfileModal__body">
        <ProfileModalContentBasicInfo />
        <ProfileModalQuestions containerClassName="ProfileModal__section" />
        <ProfileModalLinks containerClassName="ProfileModal__section" />
        <ProfileModalBadges
          containerClassName={"ProfileModal__section"}
          venue={venue}
        />
        <ProfileModalForeignUserButtons
          containerClassName="ProfileModal__section"
          openChat={openChosenUserChat}
          chosenUser={selectedUserProfile}
        />
      </Modal.Body>
    </Modal>
  );
};
