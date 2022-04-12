import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ALWAYS_NOOP_FUNCTION, REACTION_TIMEOUT } from "settings";

import { addReaction } from "store/actions/Reactions";

import {
  EMOJI_REACTIONS,
  EmojiReactionType,
  ReactionData,
} from "types/reactions";

import { createEmojiReaction, createTextReaction } from "utils/reactions";

import { useDispatch } from "hooks/useDispatch";
import { useLiveUser } from "hooks/user/useLiveUser";

import { Reaction } from "components/atoms/Reaction";

import "./ReactionsBar.scss";

interface ChatOutDataType {
  text: string;
}

export interface ReactionsBarProps {
  venueId: string;
  reactions?: ReactionData<EmojiReactionType>[];
  isReactionsMuted: boolean;
  isAudioDisabled: boolean;
  toggleMute: () => void;
  leaveSeat?: () => void;
  isShoutoutsEnabled: boolean;
}

export const ReactionsBar: React.FC<ReactionsBarProps> = ({
  venueId,
  isReactionsMuted,
  isAudioDisabled,
  reactions = EMOJI_REACTIONS,
  toggleMute,
  leaveSeat,
  isShoutoutsEnabled,
}) => {
  const dispatch = useDispatch();
  const { userWithId } = useLiveUser();

  const muteClasses = classNames("ReactionsBar__mute-button", {
    "ReactionsBar__mute-button--disabled": isAudioDisabled,
  });

  const handleToggleMute = isAudioDisabled ? ALWAYS_NOOP_FUNCTION : toggleMute;
  const [isShoutSent, setIsShoutSent] = useState(false);

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

  const { register, handleSubmit, reset } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  // @debt This should probably be all rolled up into a single canonical component.
  // Possibly ShoutoutBar or similar.
  const onSubmit = async (data: ChatOutDataType) => {
    setIsShoutSent(true);

    if (!userWithId) {
      return;
    }
    dispatch(
      addReaction({
        venueId,
        reaction: createTextReaction(data.text, userWithId),
      })
    );

    reset();
  };

  useEffect(() => {
    if (isShoutSent) {
      setTimeout(() => {
        setIsShoutSent(false);
      }, REACTION_TIMEOUT);
    }
  }, [isShoutSent]);

  return (
    <div className="ReactionsBar">
      <div className="ReactionsBar__reactions-container">
        {renderedReactions}

        <div className={muteClasses} onClick={handleToggleMute}>
          <FontAwesomeIcon
            icon={isReactionsMuted ? faVolumeMute : faVolumeUp}
          />
        </div>

        {leaveSeat && (
          <button
            className="ReactionsBar__leave-seat-button"
            onClick={leaveSeat}
          >
            Leave Seat
          </button>
        )}
      </div>
      {isShoutoutsEnabled && (
        // @debt This should probably be all rolled up into a single canonical component.
        // Possibly ShoutoutBar or similar.
        <div className="ReactionsBar__shout-container">
          <form onSubmit={handleSubmit(onSubmit)} className="shout-form">
            <input
              className="text"
              placeholder="Shout out to the crowd"
              {...register("text", { required: true })}
              disabled={isShoutSent}
              autoComplete="off"
            />
            <input
              className={`shout-button ${isShoutSent ? "btn-success" : ""} `}
              type="submit"
              id={`send-shout-out`}
              value={isShoutSent ? "Sent!" : "Send"}
              disabled={isShoutSent}
            />
          </form>
        </div>
      )}
    </div>
  );
};
