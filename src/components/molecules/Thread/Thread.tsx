import React, { useMemo } from "react";

import {
  Thread as TThread,
  ThreadReply as TThreadReply,
  MessageToDisplay,
} from "types/chat";

import { WithId } from "utils/id";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";

import { ThreadReply } from "./ThreadReply/ThreadReply";

export interface ThreadProps {
  thread: MessageToDisplay<TThread>;
  threadReplies: WithId<MessageToDisplay<TThreadReply>>[];
  deleteMessage: () => void;
}

export const Thread: React.FC<ThreadProps> = ({
  thread,
  threadReplies,
  deleteMessage,
}) => {
  const renderedThreadReplies = useMemo(
    () =>
      threadReplies.map((threadReply) => (
        <ThreadReply
          key={threadReply.id}
          reply={threadReply}
          deleteMessage={deleteMessage}
        />
      )),
    [threadReplies, deleteMessage]
  );
  return (
    <div className="Tread">
      <div>{renderedThreadReplies}</div>
      <ChatMessageInfo message={thread} deleteMessage={deleteMessage} />
    </div>
  );
};
