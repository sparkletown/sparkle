import React, { useMemo } from "react";
import classNames from "classnames";

import {
  EmojiReactionType,
  isTextReaction,
  ReactionData,
} from "types/reactions";

import { uniqueEmojiReactionsDataMapReducer } from "utils/reactions";

import { useAudio } from "hooks/audio/useAudio";
import { useReactions } from "hooks/reactions";

import { Reaction } from "components/atoms/Reaction";

import "./UserReactions.scss";

export interface UserReactionsProps {
  userId: string;
  isMuted?: boolean;
  reactionPosition?: "left" | "right";
}

export const UserReactions: React.FC<UserReactionsProps> = ({
  userId,
  isMuted: isMutedLocally = false,
  reactionPosition,
}) => {
  const isMuted = isMutedLocally;

  const userReactions = useReactions({
    userId,
  });

  const { userUniqueEmojiReactions, userShoutout } = useMemo(() => {
    const userUniqueEmojiReactions = Array.from(
      userReactions
        .reduce(uniqueEmojiReactionsDataMapReducer, new Map())
        .values()
    );

    const userShoutout = userReactions.find(isTextReaction);

    return { userUniqueEmojiReactions, userShoutout };
  }, [userReactions]);

  const containerClasses = classNames(
    "UserReactions",
    `UserReactions--reaction-${reactionPosition}`
  );

  const renderedEmojis = useMemo(
    () =>
      userUniqueEmojiReactions.map((emojiReaction) => (
        <DisplayEmojiReaction
          key={emojiReaction.type}
          emojiReaction={emojiReaction}
          isMuted={isMuted}
        />
      )),
    [userUniqueEmojiReactions, isMuted]
  );

  const hasReactions = userUniqueEmojiReactions.length > 0 || userShoutout;

  if (!hasReactions) return <></>;
  return (
    <div className={containerClasses}>
      {renderedEmojis}
      {userShoutout && (
        <div className="UserReactions__shout">{userShoutout.text}</div>
      )}
    </div>
  );
};

export interface EmojiReactionProps {
  emojiReaction: ReactionData<EmojiReactionType>;
  isMuted?: boolean;
}

export const DisplayEmojiReaction: React.FC<EmojiReactionProps> = ({
  emojiReaction,
  isMuted = false,
}) => {
  const { audioPath } = emojiReaction;
  useAudio({ audioPath, isMuted });

  return <Reaction reaction={emojiReaction} />;
};
