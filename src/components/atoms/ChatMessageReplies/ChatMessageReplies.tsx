import React from "react";

import { ChatMessageInfo } from "components/atoms/ChatMessageInfo";
import { useChatboxThread } from "components/molecules/Chatbox/components/context/ChatboxContext";
import { Loading } from "components/molecules/Loading";
import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./ChatMessageReplies.scss";

type ChatMessageRepliesProps = {
  threadId: string;
};

export const ChatMessageReplies: React.FC<ChatMessageRepliesProps> = ({
  threadId,
}) => {
  const [thread, isThreadLoaded] = useChatboxThread(threadId);

  return (
    <div className="ChatMessageReplies">
      {isThreadLoaded ? (
        thread?.map((reply) => (
          <div key={reply.id} className="ChatMessageReplies__reply">
            <RenderMarkdown text={reply.text} allowHeadings={false} />
            <ChatMessageInfo message={reply} threadId={threadId} />
          </div>
        ))
      ) : (
        <Loading containerClassName="ChatMessageReplies__loading" />
      )}
    </div>
  );
};
