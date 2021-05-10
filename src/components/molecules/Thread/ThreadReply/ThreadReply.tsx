import React from "react";

import { ThreadReply as TThreadReply, MessageToDisplay } from "types/chat";

import { WithId } from "utils/id";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";

export interface ThreadReplyProps {
  reply: WithId<MessageToDisplay<TThreadReply>>;
  deleteMessage: () => void;
}

export const ThreadReply: React.FC<ThreadReplyProps> = ({
  reply,
  deleteMessage,
}) => {
  return (
    <div className="ThreadReply">
      <ChatMessageInfo message={reply} deleteMessage={deleteMessage} />;
    </div>
  );
};
