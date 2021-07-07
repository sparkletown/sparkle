import React, { useCallback } from "react";

import { EmojiReactionType, ReactionData } from "types/reactions";

import "./Reaction.scss";

export interface PropsType {
  reaction: ReactionData<EmojiReactionType>;
  reactionClicked: (emojiReaction: EmojiReactionType) => void;
}

export const Reaction: React.FC<PropsType> = ({
  reaction,
  reactionClicked,
}) => {
  const handleReactionClick = useCallback(() => {
    reactionClicked(reaction.type);
  }, [reactionClicked, reaction]);

  return (
    <button
      className="Reaction"
      onClick={handleReactionClick}
      id={`send-reaction-${reaction.type}`}
    >
      <span role="img" aria-label={reaction.ariaLabel}>
        {reaction.text}
      </span>
    </button>
  );
};
