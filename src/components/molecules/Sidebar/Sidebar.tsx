import React, { useCallback, useState } from "react";

import {
  chatUsersSelector,
  currentVenueSelector,
  parentVenueSelector,
  unreadMessagesSelector,
  privateChatsSelector,
} from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { isChatValid } from "validation";

import VenueChat from "components/molecules/VenueChat";
import ChatsList from "components/molecules/ChatsList";
import LiveSchedule from "components/molecules/LiveSchedule";

import "./Sidebar.scss";

enum TABS {
  PARTY_CHAT = 0,
  PRIVATE_CHAT = 1,
  LIVE_SCHEDULE = 2,
}

const Sidebar = () => {
  const notificationSound = "/sounds/notification.m4a";
  const venue = useSelector(currentVenueSelector);
  const parentVenue = useSelector(parentVenueSelector);

  const [tab, setTab] = useState(0);

  const chatUsers = useSelector(chatUsersSelector) ?? [];
  const hasUnreadMessages = useSelector(unreadMessagesSelector);

  const numberOfUnreadMessages = useMemo(() => {
    if (!user || !privateChats) return 0;

    return privateChats
      .filter(isChatValid)
      .filter((chat) => chat.to === user.uid && !chat.isRead).length;
  }, [privateChats, user]);
  const isEnabled = chatUsers;

  const currentVenueChatTitle = venue?.chatTitle ?? "Party";
  const chatTitle = parentVenue?.chatTitle ?? currentVenueChatTitle;

  const selectPartyChatTab = useCallback(() => {
    isEnabled && setTab(TABS.PARTY_CHAT);
  }, [isEnabled]);

  const selectPrivateChatTab = useCallback(() => {
    isEnabled && setTab(TABS.PRIVATE_CHAT);
  }, [isEnabled]);

  const selectLiveScheduleTab = useCallback(() => {
    isEnabled && setTab(TABS.LIVE_SCHEDULE);
  }, [isEnabled]);

  return (
    <div className="sidebar-container">
      <div className="sidebar-slide-btn">
        <div className="slide-btn-arrow-icon" />
        <div className="slide-btn-chat-icon" />
      </div>

      <div className="sidebar-tabs">
        <div
          className={`sidebar-tab sidebar-tab_chat ${
            tab === TABS.PARTY_CHAT && "active"
          }`}
          onClick={selectPartyChatTab}
        >
          {chatTitle} Chat
        </div>

        <div
          className={`sidebar-tab sidebar-tab_private ${
            tab === TABS.PRIVATE_CHAT && "active"
          }`}
          onClick={selectPrivateChatTab}
        >
          {hasUnreadMessages && <div className="notification"></div>}
          <span>Messages</span>
          
          {numberOfUnreadMessages > 0 && (
                        <span>
                          ({numberOfUnreadMessages}) <audio autoPlay ><source src={notificationSound} /></audio>
                        </span>
                      )}
        </div>

        <div
          className={`sidebar-tab sidebar-tab_schedule ${
            tab === TABS.LIVE_SCHEDULE && "active"
          }`}
          onClick={selectLiveScheduleTab}
        >
          Live Schedule
        </div>
      </div>

      {tab === TABS.PARTY_CHAT && <VenueChat />}
      {tab === TABS.PRIVATE_CHAT && <ChatsList />}
      {tab === TABS.LIVE_SCHEDULE && <LiveSchedule />}
    </div>
  );
};

export default Sidebar;
