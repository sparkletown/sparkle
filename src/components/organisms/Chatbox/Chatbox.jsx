import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import UserProfileModal from "components/organisms/UserProfileModal";

import { isChatValid } from "validation";

import ChatForm from "./ChatForm";
import "./Chatbox.scss";

// Don't pull everything
// REVISIT: only grab most recent N from server
const RECENT_MESSAGE_COUNT = 200;

const Chatbox = () => {
  useFirestoreConnect("chats");
  let { chats } = useSelector((state) => ({
    chats: state.firestore.ordered.chats,
  }));

  const [selectedUserProfile, setSelectedUserProfile] = useState();

  const { users, currentUserUID } = useSelector((state) => ({
    users: state.firestore.data.users,
    currentUserUID: state.user.uid,
  }));

  if (!chats) {
    return "Loading chat...";
  }

  chats = chats
    .filter(isChatValid)
    .concat()
    .sort((a, b) => b.ts_utc - a.ts_utc)
    .slice(0, RECENT_MESSAGE_COUNT);

  return (
    <>
      <div className="chatbox-container">
        <div className="chatbox-title">
          <img
            src="/sparkle-icon.png"
            className="side-title-icon"
            alt="sparkle icon"
            width="20"
          />
          Party Chat
        </div>
        {users && (
          <>
            <ChatForm
              currentUser={users[currentUserUID]}
              currentUserUID={currentUserUID}
            />
            <div className="message-container">
              <ul>
                {chats.map((chat) => (
                  <li key={chat.id} className="chat-message">
                    {chat.userId && users[chat.userId] && (
                      <img
                        src={users[chat.userId].pictureUrl}
                        className="profile-icon avatar-picture"
                        alt={chat.name}
                        onClick={() =>
                          setSelectedUserProfile(users[chat.userId])
                        }
                      />
                    )}
                    <b>{chat.name}</b>: {chat.text}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      <UserProfileModal
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
        userProfile={selectedUserProfile}
      />
    </>
  );
};

export default Chatbox;
