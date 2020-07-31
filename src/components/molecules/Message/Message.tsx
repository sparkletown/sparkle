import React from "react";
import { User } from "types/User";
import { RestrictedChatMessage } from "components/context/ChatContext";
import { DEFAULT_PROFILE_IMAGE } from "settings";

interface MessageProps {
  sender: User;
  message: RestrictedChatMessage;
  onClick: () => void;
}

const Message: React.FC<MessageProps> = ({ sender, message, onClick }) => {
  const profileImageSize = 40;
  return (
    <div className="message" key={`${message.from}-${message.ts_utc}`}>
      <img
        onClick={onClick}
        key={`${message.from}-messaging-the-band`}
        className="profile-icon"
        src={sender.pictureUrl || DEFAULT_PROFILE_IMAGE}
        title={sender.partyName}
        alt={`${sender.partyName} profile`}
        width={profileImageSize}
        height={profileImageSize}
      />
      <div className="message-bubble">{message.text}</div>
    </div>
  );
};

export default Message;
