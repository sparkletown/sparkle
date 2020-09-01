import React from "react";
import { User } from "types/User";
import { RestrictedChatMessage } from "components/context/ChatContext";
import { DEFAULT_PROFILE_IMAGE } from "settings";
import { WithId } from "utils/id";
import { getLinkFromText } from "../../../utils/getLinkFromText";
import { formatUtcSeconds } from "../../../utils/time";

interface MessageProps {
  sender: WithId<User>;
  message: RestrictedChatMessage;
  onClick: () => void;
}

export const Message: React.FC<MessageProps> = ({
  sender,
  message,
  onClick,
}) => {
  const profileImageSize = 30;
  return (
    <div
      className="message chat-message"
      key={`${message.from}-${message.ts_utc}`}
    >
      <div className="sender-info">
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
        <div>
          {sender.partyName}{" "}
          <span className="timestamp">{formatUtcSeconds(message.ts_utc)}</span>
        </div>
      </div>
      <div className="message-bubble split-words">
        {getLinkFromText(message.text)}
      </div>
    </div>
  );
};
