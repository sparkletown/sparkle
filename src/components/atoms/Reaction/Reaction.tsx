import React, { useCallback } from "react";
import { UserInfo } from "firebase/app";
import { useUser } from "hooks/useUser";
import "./Reaction.scss";
import { ReactionsType, EmojiReactionType } from "utils/reactions";

interface PropsType {
  reaction: ReactionsType;
  reactionClicked: (user: UserInfo, reaction: EmojiReactionType) => void;
}

const Reaction: React.FC<PropsType> = ({ reaction, reactionClicked }) => {
  const { user } = useUser();
  const handleReactionClick = useCallback(() => {
    user && reactionClicked(user, reaction.type);
  }, [user, reactionClicked, reaction]);

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
