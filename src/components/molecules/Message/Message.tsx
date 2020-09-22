import React from "react";
import { User } from "types/User";
import { RestrictedChatMessage } from "components/context/ChatContext";
import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";
import { WithId } from "utils/id";
import { getLinkFromText } from "../../../utils/getLinkFromText";
import { formatUtcSeconds } from "../../../utils/time";

interface MessageProps {
  sender: WithId<User>;
  message: RestrictedChatMessage;
  onClick: () => void;
  deletable: boolean;
  onDelete: () => void;
}

export const Message: React.FC<MessageProps> = ({
  sender,
  message,
  onClick,
  deletable,
  onDelete,
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
          src={(!sender.anonMode && sender.pictureUrl) || DEFAULT_PROFILE_IMAGE}
          title={(!sender.anonMode && sender.partyName) || DEFAULT_PARTY_NAME}
          alt={`${
            (!sender.anonMode && sender.partyName) || DEFAULT_PARTY_NAME
          } profile`}
          width={profileImageSize}
          height={profileImageSize}
        />
        <div>
          {(!sender.anonMode && sender.partyName) || DEFAULT_PARTY_NAME}{" "}
          <span className="timestamp">{formatUtcSeconds(message.ts_utc)}</span>
          {deletable && (
            <button className="btn-link delete-button" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
      <div className="message-bubble split-words">
        {getLinkFromText(message.text)}
      </div>
    </div>
  );
};
