import React from "react";
import "./ChatMessage.scss";

interface ChatMessageType {
  id: string;
  from: string;
  text: string;
  to?: string;
  type: string;
}

interface PropsType {
  chat: ChatMessageType;
  users: any;
  isInProfileModal: boolean;
  setSelectedUserProfile: (value: React.SetStateAction<undefined>) => void;
  user: any;
}

const ChatMessage: React.FunctionComponent<PropsType> = ({
  chat,
  users,
  user,
  isInProfileModal,
  setSelectedUserProfile,
}) => {
  const getRecipient = () => {
    switch (chat.type) {
      case "global":
        return "everybody";
      case "private":
        return chat.to === user.uid
          ? "you"
          : chat.to && users[chat.to].partyName;
      case "room":
        return `${chat.to} room`;
      case "table":
        return chat.from;
      default:
        return;
    }
  };

  const getSender = () =>
    user.uid === chat.from ? "you" : users[chat.from].partyName;

  return (
    <div className="chat-message">
      <div className="sender-information">
        {chat.from && users[chat.from] && (
          <img
            src={users[chat.from].pictureUrl}
            className="profile-icon avatar-picture"
            alt={chat.to}
            onClick={() => {
              !isInProfileModal &&
                setSelectedUserProfile({
                  ...users[chat.from],
                  id: chat.from,
                });
            }}
          />
        )}
        <span className="xs-size">
          <b>{getSender()}</b> to <b>{getRecipient()}</b>
        </span>
      </div>
      <div
        className={`message-buble ${chat.type} ${
          getSender() === "you" ? "right-side" : ""
        }`}
      >
        {chat.text}
      </div>
    </div>
  );
};

export default ChatMessage;
