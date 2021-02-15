import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

import { VenueChat, PrivateChats } from "./components";

import {
  useChatsSidebarControls,
  useChatsSidebarInfo,
} from "hooks/useChatsSidebar";

import { ChatTypes } from "types/chat";

import "./ChatSidebar.scss";

export const ChatSidebar: React.FC = () => {
  const {
    isChatSidebarVisible,
    chatSettings,

    openVenueChat,
    openPrivateChats,
    closeChat,
    expandChat,
  } = useChatsSidebarControls();

  const { privateChatTabTitle, venueChatTabTitle } = useChatsSidebarInfo();

  return (
    <div
      className={classNames("chat-sidebar-component", {
        "chat-sidebar-component--expanded": isChatSidebarVisible,
      })}
    >
      <div className="chat-sidebar-header">
        <div
          className="chat-sidebar-controller"
          onClick={isChatSidebarVisible ? closeChat : expandChat}
        >
          {isChatSidebarVisible ? (
            <FontAwesomeIcon
              icon={faChevronRight}
              className={classNames("chatbox-input-button_icon", {
                "chatbox-input-button_icon--active": true,
              })}
              size="sm"
            />
          ) : (
            <>
              <FontAwesomeIcon
                icon={faChevronLeft}
                className={classNames(
                  "chatbox-input-button_icon",
                  "chatbox-input-button_icon-right-chevron",
                  {
                    "chatbox-input-button_icon--active": true,
                  }
                )}
                size="sm"
              />
              <FontAwesomeIcon
                icon={faCommentDots}
                className={classNames("chatbox-input-button_icon", {
                  "chatbox-input-button_icon--active": true,
                })}
                size="lg"
              />
            </>
          )}
        </div>

        <div className="chat-sidebar-tabs">
          <div
            className={classNames("chat-sidebar-tab", {
              "chat-sidebar-tab--selected":
                chatSettings.openedChatType === ChatTypes.VENUE_CHAT,
            })}
            onClick={openVenueChat}
          >
            {venueChatTabTitle}
          </div>
          <div
            className={classNames("chat-sidebar-tab", {
              "chat-sidebar-tab--selected":
                chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT,
            })}
            onClick={openPrivateChats}
          >
            {privateChatTabTitle}
          </div>
        </div>
      </div>
      <div className="chat-sidebar-content">
        {chatSettings.openedChatType === ChatTypes.VENUE_CHAT && <VenueChat />}
        {chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT && (
          <PrivateChats recipientId={chatSettings.recipientId} />
        )}
      </div>
    </div>
  );
};
