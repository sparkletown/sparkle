import React, { useCallback } from "react";
import "./Reaction.scss";
import { EmojiReactionType, ReactionData } from "types/reactions";

interface PropsType {
  reaction: ReactionData<EmojiReactionType>;
  reactionClicked: (emojiReaction: EmojiReactionType) => void;
}

const Reaction: React.FC<PropsType> = ({ reaction, reactionClicked }) => {
  const handleReactionClick = useCallback(() => {
    reactionClicked(reaction.type);
  }, [reactionClicked, reaction]);

  return (
    <button
      className="reaction"
      onClick={handleReactionClick}
      id={`send-reaction-${reaction.type}`}
    >
      <span role="img" aria-label={reaction.ariaLabel}>
        {reaction.text}
      </span>
    </button>
  );
};

export default Reaction;
