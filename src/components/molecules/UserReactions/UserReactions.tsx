import React, { useMemo } from "react";
import classNames from "classnames";

import {
  isTextReaction,
  ReactionData,
  EmojiReactionType,
} from "types/reactions";
import { User } from "types/User";

import { WithId } from "utils/id";
import { uniqueEmojiReactionsDataMapReducer } from "utils/reactions";

import { useReactions } from "hooks/reactions";
import { useSelector } from "hooks/useSelector";

import "./UserReactions.scss";

export interface UserReactionsProps {
  user: WithId<User>;
  isMuted?: boolean;
  reactionPosition?: "left" | "right";
}

export const UserReactions: React.FC<UserReactionsProps> = ({
  user,
  isMuted: isMutedLocally = false,
  reactionPosition,
  children,
}) => {
  // @debt some of the redux patterns exist for this, but I don't believe anything actually uses them/calls this at the moment. Used in MapPartygoersOverlay
  const isMutedGlobally = useSelector((state) => state.room.mute);
  const isMuted = isMutedLocally || isMutedGlobally;

  const userReactions = useReactions({
    userId: user?.id,
  });

  const { renderedEmojiReactions, userShoutout } = useMemo(() => {
    const userUniqueEmojiReactions = userReactions.reduce(
      uniqueEmojiReactionsDataMapReducer,
      new Map()
    );

    const renderedEmojiReactions = Array.from(
      userUniqueEmojiReactions.values()
    ).map((emojiReaction) => (
      <DisplayEmojiReaction
        key={emojiReaction.type}
        emojiReaction={emojiReaction}
        isMuted={isMuted}
      />
    ));

    const userShoutout = userReactions.find(isTextReaction);

    return { renderedEmojiReactions, userShoutout };
  }, [isMuted, userReactions]);

  const containerClasses = classNames(
    "UserReactions",
    `UserReactions--reaction-${reactionPosition}`
  );

  return (
    <div className={containerClasses}>
      {children}

      {renderedEmojiReactions}

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
  const { ariaLabel, text: emojiText, audioPath } = emojiReaction;

  return (
    <div className="UserReactions__reaction" role="img" aria-label={ariaLabel}>
      {emojiText}

      {/* @debt replace this with useSound or calling new Audio in useEffect or similar */}
      {!isMuted && (
        <audio autoPlay loop>
          <source src={audioPath} />
        </audio>
      )}
    </div>
  );
};
