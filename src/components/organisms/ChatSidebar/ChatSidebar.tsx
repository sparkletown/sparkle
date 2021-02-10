import React, { useCallback } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

import { WorldChat, VenueChat, PrivateChat } from "./components";

import {
  useChatsSidebarControls,
  useChatsSidebarInfo,
} from "hooks/useChatsSidebar";

import { ChatTypes } from "types/chat";

import "./ChatSidebar.scss";

export const ChatSidebar: React.FC = () => {
  const {
    isChatSidebarVisible,
    openChat,
    openedChatType,
    closeChat,
  } = useChatsSidebarControls();
  const {
    worldChatTabTitle,
    privateChatTabTitle,
    venueChatTabTitle,
  } = useChatsSidebarInfo();

  const selectPrivateChatTab = useCallback(() => {
    openChat({ chatType: ChatTypes.PRIVATE_CHAT });
  }, [openChat]);

  const selectVenueChatTab = useCallback(() => {
    openChat({ chatType: ChatTypes.VENUE_CHAT });
  }, [openChat]);

  const expandChat = () => {
    openChat();
  };

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
                openedChatType === ChatTypes.VENUE_CHAT,
            })}
            onClick={selectVenueChatTab}
          >
            {venueChatTabTitle}
          </div>
          <div
            className={classNames("chat-sidebar-tab", {
              "chat-sidebar-tab--selected":
                openedChatType === ChatTypes.PRIVATE_CHAT,
            })}
            onClick={selectPrivateChatTab}
          >
            {privateChatTabTitle}
          </div>
        </div>
      </div>
      <div className="chat-sidebar-content">
        {openedChatType === ChatTypes.VENUE_CHAT && <VenueChat />}
        {openedChatType === ChatTypes.PRIVATE_CHAT && <PrivateChat />}
      </div>
    </div>
  );
};
