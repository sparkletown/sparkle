import React, { useCallback, useState } from "react";

import {
  chatUsersSelector,
  currentVenueSelector,
  parentVenueSelector,
  unreadMessagesSelector,
} from "utils/selectors";

import { useSelector } from "hooks/useSelector";

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
  const venue = useSelector(currentVenueSelector);
  const parentVenue = useSelector(parentVenueSelector);

  const [tab, setTab] = useState(0);

  const chatUsers = useSelector(chatUsersSelector) ?? [];
  const hasUnreadMessages = useSelector(unreadMessagesSelector);

  const isEnabled = chatUsers;

  const currentVenueChatTitle = venue.chatTitle ?? "Party";
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
            hasUnreadMessages && "notification"
          } ${tab === TABS.PRIVATE_CHAT && "active"}`}
          onClick={selectPrivateChatTab}
        >
          Messages
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
