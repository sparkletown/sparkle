import React from "react";
import { AllEmojiReactions, EmojiReactionType } from "types/reactions";

import "./UserPersistentReaction.scss";

export interface UserPersistentReactionProps {
  emojiReaction: EmojiReactionType;
}

export const UserPersistentReaction: React.FC<UserPersistentReactionProps> = ({
  emojiReaction,
}) => {
  const { text: emojiText, ariaLabel } = React.useMemo(
    () =>
      AllEmojiReactions.find((reaction) => reaction.type === emojiReaction)!,
    [emojiReaction]
  );

  return (
    <div className={"UserPersistentReaction"}>
      <div
        className="UserPersistentReaction__reaction"
        role="img"
        aria-label={ariaLabel}
      >
        {emojiText}
      </div>
    </div>
  );
};
