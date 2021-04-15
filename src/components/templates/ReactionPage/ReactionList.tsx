import React, { useMemo } from "react";
import classNames from "classnames";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { ChatMessage } from "types/chat";
import {
  chatMessageAsTextReaction,
  isEmojiReaction,
  Reaction,
  ReactionsTextMap,
} from "types/reactions";

import { withId } from "utils/id";

import { useWorldUsersByIdWorkaround } from "hooks/users";

import UserProfilePicture from "components/molecules/UserProfilePicture";
import { UserAvatar } from "components/atoms/UserAvatar";

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

      const messageSenderImage = messageSender?.anonMode
        ? DEFAULT_PROFILE_IMAGE
        : messageSender?.pictureUrl ?? DEFAULT_PROFILE_IMAGE;

      const messageSenderName = messageSender?.anonMode
        ? DEFAULT_PARTY_NAME
        : messageSender?.partyName ?? DEFAULT_PARTY_NAME;

      return (
        <div
          className="message"
          key={`${message.created_by}-${message.created_at}`}
        >
          {/* @debt Ideally we would only have one type of 'user avatar' component that would work for all of our needs */}
          {messageSenderWithId !== undefined ? (
            <UserProfilePicture user={messageSenderWithId} />
          ) : (
            <UserAvatar avatarSrc={messageSenderImage} />
          )}

          <div className="partyname-bubble">{messageSenderName}</div>

          <div
            className={classNames("message-bubble", {
              emoji: isEmojiReaction(message),
            })}
          >
            {isEmojiReaction(message)
              ? ReactionsTextMap[message.reaction]
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
