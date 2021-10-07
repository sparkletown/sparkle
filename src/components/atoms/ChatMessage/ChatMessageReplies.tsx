import React, { useMemo } from "react";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import {
  useChatboxDeleteThreadMessage,
  useChatboxThread,
} from "components/molecules/Chatbox/components/context/ChatboxContext";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";

import "./ChatMessage.scss";

type ChatMessageRepliesProps = {
  threadId: string;
};

export const ChatMessageReplies: React.FC<ChatMessageRepliesProps> = ({
  threadId,
}) => {
  const thread = useChatboxThread(threadId);
  const deleteThreadReply = useChatboxDeleteThreadMessage();

  const rendered = useMemo(
    () =>
      thread?.map((reply) => {
        const deleteReplyMessage = async () =>
          deleteThreadReply?.({ threadId, messageId: reply.id });

        return (
          <div key={reply.id} className="ChatMessage__reply">
            <RenderMarkdown text={reply.text} allowHeadings={false} />
            <ChatMessageInfo
              message={reply}
              deleteMessage={deleteThreadReply && deleteReplyMessage}
            />
          </div>
        );
      }),
    [deleteThreadReply, thread, threadId]
  );

  return <div className="ChatMessage__replies">{rendered}</div>;
};
