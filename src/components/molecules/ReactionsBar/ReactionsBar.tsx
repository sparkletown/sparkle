import React, { useCallback, useMemo } from "react";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { addReaction } from "store/actions/Reactions";

import {
  EMOJI_REACTIONS,
  EmojiReactionType,
  ReactionData,
} from "types/reactions";

import { createEmojiReaction } from "utils/reactions";

import { useDispatch } from "hooks/useDispatch";
import { useUser } from "hooks/useUser";

import { Reaction } from "components/atoms/Reaction";

import "./ReactionsBar.scss";

export interface ReactionsBarProps {
  venueId: string;
  reactions?: ReactionData<EmojiReactionType>[];
  isReactionsMuted: boolean;
  isAudioDisabled: boolean;
  toggleMute: () => void;
  leaveSeat?: () => void;
}

export const ReactionsBar: React.FC<ReactionsBarProps> = ({
  venueId,
  isReactionsMuted,
  isAudioDisabled,
  reactions = EMOJI_REACTIONS,
  toggleMute,
  leaveSeat,
}) => {
  const dispatch = useDispatch();
  const { userWithId } = useUser();

  const muteClasses = classNames("ReactionsBar__mute-button", {
    "ReactionsBar__mute-button--disabled": isAudioDisabled,
  });

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

  const renderedReactions = useMemo(
    () =>
      reactions.map((reaction) => (
        <Reaction
          key={reaction.name}
          reaction={reaction}
          onReactionClick={sendReaction}
        />
      )),
    [reactions, sendReaction]
  );

  return (
    <div className="ReactionsBar">
      {renderedReactions}

      <div className={muteClasses} onClick={toggleMute}>
        <FontAwesomeIcon icon={isReactionsMuted ? faVolumeMute : faVolumeUp} />
      </div>

      {leaveSeat && (
        <button className="ReactionsBar__leave-seat-button" onClick={leaveSeat}>
          Leave Seat
        </button>
      )}
    </div>
  );
};
