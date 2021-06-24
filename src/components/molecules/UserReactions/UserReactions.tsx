import React, { useMemo } from "react";
import { useCss } from "react-use";
import classNames from "classnames";
import { getSeconds } from "date-fns";

import { REACTION_TIMEOUT } from "settings";

import {
  isTextReaction,
  ReactionData,
  EmojiReactionType,
} from "types/reactions";

import { uniqueEmojiReactionsDataMapReducer } from "utils/reactions";

import { useReactions } from "hooks/reactions";
import { useSelector } from "hooks/useSelector";

import "./UserReactions.scss";

const REACTION_TIMEOUT_CSS = `${getSeconds(REACTION_TIMEOUT)}s`;

export interface UserReactionsProps {
  userId: string;
  isMuted?: boolean;
  reactionPosition?: "left" | "right";
}

export const UserReactions: React.FC<UserReactionsProps> = ({
  userId,
  isMuted: isMutedLocally = false,
  reactionPosition,
  children,
}) => {
  // @debt some of the redux patterns exist for this, but I don't believe anything actually uses them/calls this at the moment. Used in MapPartygoersOverlay
  const isMutedGlobally = useSelector((state) => state.room.mute);
  const isMuted = isMutedLocally || isMutedGlobally;

  const userReactions = useReactions({
    userId,
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

  const containerVars = useCss({
    "--user-reactions-reaction-timeout": REACTION_TIMEOUT_CSS,
  });

  const containerClasses = classNames(
    "UserReactions",
    `UserReactions--reaction-${reactionPosition}`,
    containerVars
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
        <audio autoPlay>
          <source src={audioPath} />
        </audio>
      )}
    </div>
  );
};
