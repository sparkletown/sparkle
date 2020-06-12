import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import UserProfileModal from "components/organisms/UserProfileModal";

import { isChatValid } from "validation";

import ChatForm from "./ChatForm";
import "./Chatbox.scss";
import { User } from "../UserProfileModal/UserProfileModal";

// Don't pull everything
// REVISIT: only grab most recent N from server
const RECENT_MESSAGE_COUNT = 200;

interface PropsType {
  discussionPartner?: User;
}

const Chatbox: React.FunctionComponent<PropsType> = ({ discussionPartner }) => {
  useFirestoreConnect("chatsv2");
  const [selectedUserProfile, setSelectedUserProfile] = useState();
  const { users, currentUserUID, chats, user } = useSelector((state: any) => ({
    users: state.firestore.data.users,
    currentUserUID: state.user.uid,
    chats: state.firestore.ordered.chatsv2,
    user: state.user,
  }));

  if (!chats) {
    return <>Loading chat...</>;
  }

  let chatsToDisplay = chats
    .filter(isChatValid)
    .concat()
    .sort((a: any, b: any) => b.ts_utc - a.ts_utc)
    .slice(0, RECENT_MESSAGE_COUNT);

  if (discussionPartner) {
    chatsToDisplay = chatsToDisplay.filter(
      (chat: any) =>
        chat.recipientId &&
        ((chat.senderId === discussionPartner.id &&
          chat.recipientId === user.uid) ||
          (chat.recipientId === discussionPartner.id &&
            chat.senderId === user.uid))
    );
  } else {
    chatsToDisplay = chatsToDisplay.filter(
      (chat: any) =>
        !chat.recipientId ||
        chat.recipientId === user.uid ||
        chat.senderId === user.uid
    );
  }

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
          Chat
        </div>
        {users && (
          <>
            <ChatForm
              discussionPartner={discussionPartner}
              currentUser={users[currentUserUID]}
              currentUserUID={currentUserUID}
            />
            <div className="message-container">
              {chatsToDisplay.map((chat: any) => (
                <div key={chat.id} className="chat-message">
                  {chat.senderId && users[chat.senderId] && (
                    <img
                      src={users[chat.senderId].pictureUrl}
                      className="profile-icon avatar-picture"
                      alt={chat.senderName}
                      onClick={() => {
                        !discussionPartner &&
                          setSelectedUserProfile({
                            ...users[chat.senderId],
                            id: chat.senderId,
                          });
                      }}
                    />
                  )}
                  <b>{chat.senderId === user.uid ? "me" : chat.senderName}</b>
                  {chat.recipientId && (
                    <>
                      {" "}
                      to{" "}
                      <b>
                        {chat.recipientId === user.uid
                          ? "me"
                          : users[chat.recipientId].partyName}
                      </b>
                    </>
                  )}
                  : {chat.text}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {!discussionPartner && (
        <UserProfileModal
          show={selectedUserProfile !== undefined}
          onHide={() => setSelectedUserProfile(undefined)}
          userProfile={selectedUserProfile}
        />
      )}
    </>
  );
};

export default Chatbox;
