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

import { withId } from "utils/id";

import { useWorldUsersByIdWorkaround } from "hooks/users";

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
  // @debt see comments in useWorldUsersByIdWorkaround
  const { worldUsersById } = useWorldUsersByIdWorkaround();

  const allReactions = useMemo(() => {
    const chatsAsBandMessages =
      chatMessages?.map(chatMessageAsTextReaction) ?? [];

    const allReactionsSorted = [
      ...(reactions ?? []),
      ...chatsAsBandMessages,
    ].sort((a, b) => b.created_at - a.created_at);

    return allReactionsSorted.map((message) => {
      const messageSender = worldUsersById[message.created_by];
      const messageSenderWithId =
        messageSender !== undefined
          ? withId(messageSender, message.created_by)
          : undefined;

      const messageSenderName = messageSender?.anonMode
        ? DEFAULT_PARTY_NAME
        : messageSender?.partyName ?? DEFAULT_PARTY_NAME;

      return (
        <div
          className="message"
          key={`${message.created_by}-${message.created_at}`}
        >
          <UserProfilePicture user={messageSenderWithId} />

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
  }, [chatMessages, reactions, worldUsersById]);

  return (
    <>
      <div className={classNames("reaction-list", { small })}>
        {allReactions}
      </div>
    </>
  );
};
