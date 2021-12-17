import React from "react";

import { isDefined } from "utils/types";

import { useSelectedReplyThread } from "components/molecules/Chatbox/components/context/ChatboxContext";

import { TextButton } from "components/atoms/TextButton";

import "./ChatboxThreadControls.scss";

export interface ChatboxThreadControlsProps {
  closeThread: () => void;
  text?: string;
}

export const ChatboxThreadControls: React.FC<ChatboxThreadControlsProps> = ({
  closeThread,
  text,
}) => {
  const threadAuthor = useSelectedReplyThread()?.fromUser?.partyName;

  return (
    <div className="ChatboxThreadControls">
      <span className="ChatboxThreadControls__text">
        {text}
        {isDefined(threadAuthor) && (
          <span className="ChatboxThreadControls__thread-author">
            {threadAuthor}
          </span>
        )}
      </span>
      <TextButton label="Cancel" onClick={closeThread} />
    </div>
  );
};
