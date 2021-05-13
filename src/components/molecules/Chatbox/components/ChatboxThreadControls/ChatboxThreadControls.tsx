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
    <div className="ChatboThreadControls">
      <span className="ChatboThreadControls__thread-author">
        replying to <b>{threadAuthor}...</b>
      </span>
      <TextButton text="Cancel" onClick={onThreadLeave} />
    </div>
  );
};
