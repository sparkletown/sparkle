import React, { useCallback } from "react";

import { WorldChat, VenueChat, PrivateChat } from "./components";

import { useChatControls, useChatInfo } from "hooks/chats";

import { CHAT_TYPES } from "types/Chat";

import "./ChatSidebar.scss";

export const ChatSidebar: React.FC = () => {
  const { isChatSidebarVisible, openChat, openedChatType } = useChatControls();
  const {
    worldChatTabTitle,
    privateChatTabTitle,
    venueChatTabTitle,
  } = useChatInfo();

  // const selectWorldChatTab = useCallback(() => {
  //   setSelectedTab(CHAT_TYPES.WORLD_CHAT);
  // }, [setSelectedTab]);

  // const selectPrivateChatTab = useCallback(() => {
  //   setSelectedTab(CHAT_TYPES.PRIVATE_CHAT);
  // }, [setSelectedTab]);

  // const selectVenueChatTab = useCallback(() => {
  //   setSelectedTab(CHAT_TYPES.VENUE_CHAT);
  // }, [setSelectedTab]);

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
            className="chat-sidebar-tab chat-sidebar-tab_venue"
            // onClick={selectVenueChatTab}
          >
            {venueChatTabTitle}
          </div>
          <div
            className="chat-sidebar-tab chat-sidebar-tab_private"
            // onClick={selectPrivateChatTab}
          >
            {privateChatTabTitle}
          </div>
        </div>
      </div>
      <div className="chat-sidebar-content">
        {openedChatType === CHAT_TYPES.VENUE_CHAT && <VenueChat />}
        {openedChatType === CHAT_TYPES.PRIVATE_CHAT && <PrivateChat />}
        {/* {openedChatType === CHAT_TYPES.WORLD_CHAT && <WorldChat />} */}
      </div>
    </div>
  );
};
