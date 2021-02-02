import React, { useCallback } from "react";
import classnames from "classnames";

import { WorldChat, VenueChat, PrivateChat } from "./components";

import { useChatControls, useChatInfo } from "hooks/chats";

import { ChatTypes } from "types/Chat";

import "./ChatSidebar.scss";

export const ChatSidebar: React.FC = () => {
  const { isChatSidebarVisible, openChat, openedChatType } = useChatControls();
  const {
    worldChatTabTitle,
    privateChatTabTitle,
    venueChatTabTitle,
  } = useChatInfo();

  // const selectWorldChatTab = useCallback(() => {
  //   setSelectedTab(ChatTypes.WORLD_CHAT);
  // }, [setSelectedTab]);

  const selectPrivateChatTab = useCallback(() => {
    openChat({ chatType: ChatTypes.PRIVATE_CHAT });
  }, [openChat]);

  const selectVenueChatTab = useCallback(() => {
    openChat({ chatType: ChatTypes.VENUE_CHAT });
  }, [openChat]);

  return (
    <div className="chat-sidebar-component">
      <div className="chat-sidebar-header">
        {/* {isChatSidebarVisible ? (
          <div className="chat-sidebar-control_close">Close</div>
        ) : (
          <div className="chat-sidebar-control_open">Open</div>
        )} */}

        <div className="chat-sidebar-tabs">
          {/* <div
            className="chat-sidebar-tab chat-sidebar-tab_world"
            // onClick={selectWorldChatTab}
          >
            {worldChatTabTitle}
          </div> */}
          <div
            className={classnames("chat-sidebar-tab", {
              "chat-sidebar-tab--selected":
                openedChatType === ChatTypes.VENUE_CHAT,
            })}
            onClick={selectVenueChatTab}
          >
            {venueChatTabTitle}
          </div>
          <div
            className={classnames("chat-sidebar-tab", {
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
        {/* {openedChatType === ChatTypes.WORLD_CHAT && <WorldChat />} */}
      </div>
    </div>
  );
};
