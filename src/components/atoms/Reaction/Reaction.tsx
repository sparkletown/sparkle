import React, { useCallback } from "react";

import { EmojiReactionType, ReactionData } from "types/reactions";

import "./Reaction.scss";

export interface ReactionProps {
  reaction: ReactionData<EmojiReactionType>;
  onReactionClick?: (emojiReaction: EmojiReactionType) => void;
}

export const Reaction: React.FC<ReactionProps> = ({
  reaction,
  onReactionClick,
}) => {
  const handleReactionClick = useCallback(
    () => void onReactionClick?.(reaction.type),
    [onReactionClick, reaction]
  );

  return (
    <button className="Reaction" onClick={handleReactionClick}>
      <span role="img" aria-label={reaction.ariaLabel}>
        {reaction.text}
      </span>
    </button>
  );
};
