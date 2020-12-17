import React from "react";
import { formatUtcSeconds } from "utils/time";
import "./ChatMessage.scss";
import { User } from "types/User";
import { UserInfo } from "firebase/app";
import { ChatMessage } from "store/actions/Chat";
import { WithId } from "utils/id";
import { getLinkFromText } from "../../../utils/getLinkFromText";

interface PropsType {
  chat: ChatMessage;
  users: Record<string, User>;
  isInProfileModal: boolean;
  setSelectedUserProfile: (
    value: React.SetStateAction<WithId<User> | undefined>
  ) => void;
  user: UserInfo;
  withoutSenderInformation?: boolean;
}

const ChatMessageComponent: React.FunctionComponent<PropsType> = ({
  chat,
  users,
  user,
  isInProfileModal,
  setSelectedUserProfile,
  withoutSenderInformation,
}) => {
  const getRecipient = () => {
    switch (chat.type) {
      case "global":
        return "Everybody";
      case "private":
        return chat.to === user.uid
          ? "you"
          : chat.to && (users[chat.to]?.partyName || "unknown user");
      case "room":
        return `${chat.to} room`;
      case "table":
        return chat.from;
      default:
        return;
    }
  };

  const sender =
    user.uid === chat.from
      ? "you"
      : users[chat.from]?.partyName || "unknown user";

  return (
    <div className="chat-message">
      {!withoutSenderInformation && (
        <div className="sender-information">
          {chat.from && users[chat.from] && (
            <img
              src={users[chat.from].pictureUrl}
              className="profile-icon avatar-picture"
              alt={chat.from}
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
            <b>{sender}</b> to <b>{getRecipient()}</b>
          </span>
        </div>
      )}
      <div
        className={`chat-content-container ${
          sender === "you" ? "right-side" : ""
        }`}
      >
        <div
          className={`bubble split-words ${chat.type} ${
            sender === "you" ? "right-side" : ""
          }`}
        >
          {getLinkFromText(chat.text)}
        </div>
        <div
          className={`chat-timestamp ${sender === "you" ? "right-side" : ""}`}
        >
          {formatUtcSeconds(chat.ts_utc.seconds)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageComponent;
