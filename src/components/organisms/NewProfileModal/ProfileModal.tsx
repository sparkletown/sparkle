import { ProfileModalSendMessageButton } from "components/organisms/NewProfileModal/components/buttons/ProfileModalSendMessageButton/ProfileModalSendMessageButton";
import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { WithId } from "utils/id";
import { AnyVenue } from "types/venues";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { ProfileModalBasicInfo } from "./components/header/ProfileModalBasicInfo/ProfileModalBasicInfo";
import { ProfileModalQuestions } from "./components/ProfileModalQuestions/ProfileModalQuestions";
import { ProfileModalLinks } from "./components/links/ProfileModalLinks/ProfileModalLinks";
import { ProfileModalBadges } from "./components/ProfileModalBadges/ProfileModalBadges";

import "./ProfileModal.scss";
import { useChatSidebarControls } from "hooks/chats/chatSidebar";

export interface UserProfileModalProps {
  venue: WithId<AnyVenue>;
}

export const profileModalWideButtonCustomStyle = {
  fontSize: 14,
  width: "100%",
};

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
        <ProfileModalBasicInfo viewingUser={selectedUserProfile} />
        <ProfileModalQuestions
          viewingUser={selectedUserProfile}
          containerClassName="ProfileModal__section"
        />
        <ProfileModalLinks
          viewingUser={selectedUserProfile}
          containerClassName="ProfileModal__section"
        />
        <ProfileModalBadges
          viewingUser={selectedUserProfile}
          containerClassName={"ProfileModal__section"}
          venue={venue}
        />
        <ProfileModalSendMessageButton
          containerClassName="ProfileModal__section"
          openChat={openChosenUserChat}
          viewingUser={selectedUserProfile}
        />
      </Modal.Body>
    </Modal>
  );
};
