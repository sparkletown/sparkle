import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

import UserProfileModal from "components/organisms/UserProfileModal";
import { VenueChat, PrivateChats } from "./components";

import {
  useChatsSidebarControls,
  useChatsSidebarInfo,
} from "hooks/useChatsSidebar";

import { ChatTypes } from "types/chat";
import { User } from "types/User";

import { WithId } from "utils/id";

import "./ChatSidebar.scss";

export const ChatSidebar: React.FC = () => {
  const [selectedProfile, setSetSelectedProfile] = useState<WithId<User>>();
  const unselectProfile = useCallback(() => setSetSelectedProfile(undefined), [
    setSetSelectedProfile,
  ]);
  const hasSelectedProfile = selectedProfile !== undefined;

  const {
    isChatSidebarVisible,
    chatSettings,

    openVenueChat,
    openPrivateChats,
    closeChat,
    expandChat,
  } = useChatsSidebarControls();

  const { privateChatTabTitle, venueChatTabTitle } = useChatsSidebarInfo();

  const containerStyles = classNames("chat-sidebar-component", {
    "chat-sidebar-component--expanded": isChatSidebarVisible,
  });

  const venueChatTabStyles = classNames("chat-sidebar-tab", {
    "chat-sidebar-tab--selected":
      chatSettings.openedChatType === ChatTypes.VENUE_CHAT,
  });

  const privateChatTabStyles = classNames("chat-sidebar-tab", {
    "chat-sidebar-tab--selected":
      chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT,
  });

  return (
    <>
      <div className={containerStyles}>
        <div className="chat-sidebar-header">
          <div
            className="chat-sidebar-controller"
            onClick={isChatSidebarVisible ? closeChat : expandChat}
          >
            {isChatSidebarVisible ? (
              <FontAwesomeIcon
                icon={faChevronRight}
                className="chatbox-input-button_icon"
                size="sm"
              />
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="chatbox-input-button_icon chatbox-input-button_icon-left-chevron"
                  size="sm"
                />
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="chatbox-input-button_icon"
                  size="lg"
                />
              </>
            )}
          </div>

          <div className="chat-sidebar-tabs">
            <div className={venueChatTabStyles} onClick={openVenueChat}>
              {venueChatTabTitle}
            </div>
            <div className={privateChatTabStyles} onClick={openPrivateChats}>
              {privateChatTabTitle}
            </div>
          </div>
        </div>
        <div className="chat-sidebar-content">
          {chatSettings.openedChatType === ChatTypes.VENUE_CHAT && (
            <VenueChat onAvatarClick={setSetSelectedProfile} />
          )}
          {chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT && (
            <PrivateChats
              recipientId={chatSettings.recipientId}
              onAvatarClick={setSetSelectedProfile}
            />
          )}
        </div>
      </div>
      <UserProfileModal
        userProfile={selectedProfile}
        show={hasSelectedProfile}
        onHide={unselectProfile}
      />
    </>
  );
};
