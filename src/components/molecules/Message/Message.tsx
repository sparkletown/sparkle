import React from "react";
import { User } from "types/User";
import { RestrictedChatMessage } from "components/context/ChatContext";
import { DEFAULT_PROFILE_IMAGE } from "settings";
import { WithId } from "utils/id";
import { getLinkFromText } from "../../../utils/getLinkFromText";

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
      <div className="message-bubble">{getLinkFromText(message.text)}</div>
    </div>
  );
};
