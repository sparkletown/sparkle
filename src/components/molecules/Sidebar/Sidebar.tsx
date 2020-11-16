import React, { useState } from "react";
import { useFirestoreConnect } from "react-redux-firebase";

import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import VenueChat from "components/molecules/VenueChat";
import ChatsList from "components/molecules/ChatsList";
import LiveSchedule from "components/molecules/LiveSchedule";

import "./Sidebar.scss";

const Sidebar = () => {
  const venueId = useVenueId();
  useFirestoreConnect({
    collection: "users",
    where: ["enteredVenueIds", "array-contains", venueId],
    storeAs: "chatUsers",
  });
  const [tab, setTab] = useState(0);
  const { privateChats, chatUsers } = useSelector((state) => ({
    privateChats: state.firestore.ordered.privatechats,
    chatUsers: state.firestore.data.chatUsers,
  }));
  const isEnabled = chatUsers && privateChats;
  return (
    <div className="sidebar-container">
      <div className="sidebar-slide-btn">
        <div className="slide-btn-arrow-icon"></div>
        <div className="slide-btn-chat-icon"></div>
      </div>
      <div className="sidebar-tabs">
        <div
          className={`sidebar-tab sidebar-tab_chat ${tab === 0 && "active"}`}
          onClick={() => isEnabled && setTab(0)}
        >
          Party Chat
        </div>
        <div
          className={`sidebar-tab sidebar-tab_private ${tab === 1 && "active"}`}
          onClick={() => isEnabled && setTab(1)}
        >
          Messages
        </div>
        <div
          className={`sidebar-tab sidebar-tab_schedule ${
            tab === 2 && "active"
          }`}
          onClick={() => isEnabled && setTab(2)}
        >
          Live Schedule
        </div>
      </div>

      {tab === 0 && <VenueChat />}
      {tab === 1 && <ChatsList />}
      {tab === 2 && <LiveSchedule />}
    </div>
  );
};

export default Sidebar;
