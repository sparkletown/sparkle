import React from "react";

import { TextButton } from "components/atoms/TextButton";

import "./ChatboxThreadControls.scss";

export interface ChatboxThreadControlsProps {
  onThreadLeave: () => void;
  threadAuthor?: string;
}

export const ChatboxThreadControls: React.FC<ChatboxThreadControlsProps> = ({
  onThreadLeave,
  threadAuthor,
}) => {
  return (
    <div className="ChatboxThreadControls">
      <span className="ChatboxThreadControls__thread-author">
        replying to <b>{threadAuthor}...</b>
      </span>
      <TextButton label="Cancel" onClick={onThreadLeave} />
    </div>
  );
};
