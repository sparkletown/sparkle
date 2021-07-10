import React, { useCallback } from "react";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { addReaction } from "store/actions/Reactions";

import { EmojiReactionType, ReactionData } from "types/reactions";

import { createEmojiReaction } from "utils/reactions";

import { useDispatch } from "hooks/useDispatch";
import { useUser } from "hooks/useUser";

import { Reaction } from "components/atoms/Reaction";

import "./ReactionsBar.scss";

export interface ReactionsBarProps {
  reactions: ReactionData<EmojiReactionType>[];
  venueId: string;
  onClickLeaveSeat?: () => void;
  isAudioEffectDisabled: boolean;
  onClickMute: () => void;
}

export const ReactionsBar: React.FC<ReactionsBarProps> = ({
  reactions,
  venueId,
  leaveSeat,
  isAudioEffectDisabled,
  onClickMute,
}) => {
  const dispatch = useDispatch();
  const { userWithId } = useUser();

  const sendReaction = useCallback(
    (emojiReaction: EmojiReactionType) => {
      if (!venueId || !userWithId) return;

      dispatch(
        addReaction({
          venueId,
          reaction: createEmojiReaction(emojiReaction, userWithId),
        })
      );
    },
    [venueId, userWithId, dispatch]
  );

  return (
    <div className="ReactionsBar">
      {reactions.map((reaction) => (
        <Reaction
          key={reaction.name}
          reaction={reaction}
          onClickReaction={sendReaction}
        />
      ))}
      <div className="ReactionsBar__mute-button" onClick={onClickMute}>
        <FontAwesomeIcon
          icon={isAudioEffectDisabled ? faVolumeMute : faVolumeUp}
        />
      </div>
      {onClickLeaveSeat && (
        <button
          className="ReactionsBar__leave-seat-button"
          onClick={onClickLeaveSeat}
        >
          Leave Seat
        </button>
      )}
    </div>
  );
};
