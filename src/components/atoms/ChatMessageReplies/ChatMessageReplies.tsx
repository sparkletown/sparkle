import React, { useMemo } from "react";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import {
  useChatboxDeleteThreadMessage,
  useChatboxThread,
} from "components/molecules/Chatbox/components/context/ChatboxContext";
import { Loading } from "components/molecules/Loading";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";

import "./ChatMessageReplies.scss";

type ChatMessageRepliesProps = {
  threadId: string;
};

export const ChatMessageReplies: React.FC<ChatMessageRepliesProps> = ({
  threadId,
}) => {
  const [thread, isThreadLoaded] = useChatboxThread(threadId);
  const deleteThreadReply = useChatboxDeleteThreadMessage();

  const rendered = useMemo(
    () =>
      thread?.map((reply) => {
        const deleteReplyMessage = async () =>
          deleteThreadReply?.({ threadId, messageId: reply.id });

        return (
          <div key={reply.id} className="ChatMessageReplies__reply">
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

  return (
    <div className="ChatMessageReplies">
      {isThreadLoaded ? (
        rendered
      ) : (
        <Loading containerClassName="ChatMessageReplies__loading" />
      )}
    </div>
  );
};
