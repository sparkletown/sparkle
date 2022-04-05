import React, { useMemo } from "react";
import classNames from "classnames";

import { DEFAULT_PARTY_NAME } from "settings";

import { ChatMessage } from "types/chat";
import {
  chatMessageAsTextReaction,
  EmojiReactionsMap,
  isEmojiReaction,
  Reaction,
} from "types/reactions";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

export interface ReactionListProps {
  reactions: Reaction[];
  chatMessages: ChatMessage[];
  small?: boolean;
}

export const ReactionList: React.FC<ReactionListProps> = ({
  reactions,
  chatMessages,
  small = false,
}) => {
  const allReactions = useMemo(() => {
    const chatsAsBandMessages =
      chatMessages?.map(chatMessageAsTextReaction) ?? [];

    const allReactionsSorted = [
      ...(reactions ?? []),
      ...chatsAsBandMessages,
    ].sort((a, b) => b.created_at - a.created_at);

    return allReactionsSorted.map((message) => {
      const messageSenderName =
        message.created_by?.partyName ?? DEFAULT_PARTY_NAME;

      return (
        <div
          className="message"
          key={`${message.created_by}-${message.created_at}`}
        >
          <UserProfilePicture user={message.created_by} />

          <div className="partyname-bubble">{messageSenderName}</div>

          <div
            className={classNames("message-bubble", {
              emoji: isEmojiReaction(message),
            })}
          >
            {isEmojiReaction(message)
              ? EmojiReactionsMap.get(message.reaction)?.text
              : message.text}
          </div>
        </div>
      );
    });
  }, [chatMessages, reactions]);

  return (
    <>
      <div className={classNames("reaction-list", { small })}>
        {allReactions}
      </div>
    </>
  );
};
