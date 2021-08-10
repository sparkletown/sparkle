import React from "react";

import { isDefined } from "utils/types";

import { TextButton } from "components/atoms/TextButton";

import "./ChatboxThreadControls.scss";

export interface ChatboxThreadControlsProps {
  closeThread: () => void;
  threadAuthor?: string;
  text?: string;
}

export const ChatboxThreadControls: React.FC<ChatboxThreadControlsProps> = ({
  closeThread,
  threadAuthor,
  text,
}) => {
  return (
    <div className="ChatboxThreadControls">
      <span className="ChatboxThreadControls__text">
        {text}
        {isDefined(threadAuthor) && (
          <span className="ChatboxThreadControls__thread-author">
            {threadAuthor}&hellip;
          </span>
        )}
      </span>
      <TextButton label="Cancel" onClick={closeThread} />
    </div>
  );
};
