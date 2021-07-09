import React, { useCallback } from "react";

import { EmojiReactionType, ReactionData } from "types/reactions";

import "./Reaction.scss";

export interface ReactionProps {
  reaction: ReactionData<EmojiReactionType>;
  onClickReaction?: (emojiReaction: EmojiReactionType) => void;
}

export const Reaction: React.FC<ReactionProps> = ({
  reaction,
  onClickReaction,
}) => {
  const handleReactionClick = useCallback(() => {
    onClickReaction && onClickReaction(reaction.type);
  }, [onClickReaction, reaction]);

  return (
    <button className="Reaction" onClick={handleReactionClick}>
      <span role="img" aria-label={reaction.ariaLabel}>
        {reaction.text}
      </span>
    </button>
  );
};
