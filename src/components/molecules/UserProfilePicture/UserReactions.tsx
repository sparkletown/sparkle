import React from "react";
import classNames from "classnames";

import {
  AllReactions,
  isTextReaction,
  isReactionCreatedBy,
} from "types/reactions";
import { User } from "types/User";

import { WithId } from "utils/id";

import { useReactions } from "hooks/useReactions";
import { useSelector } from "hooks/useSelector";

import "./UserReactions.scss";

export interface UserReactionsProps {
  venueId: string;
  user: WithId<User>;
  isMuted?: boolean;
  reactionPosition?: "left" | "right";
}

export const UserReactions: React.FC<UserReactionsProps> = ({
  venueId,
  user,
  isMuted: isMutedLocally = false,
  reactionPosition,
}) => {
  const reactions = useReactions(venueId);

  // TODO: memo/etc these as required
  const userReactions = reactions.filter(isReactionCreatedBy(user.id));
  const userShoutout = userReactions.find(isTextReaction);

  // @debt some of the redux patterns exist for this, but I don't believe anything actually uses them/calls this at the moment. Used in MapPartygoersOverlay
  const isMutedGlobally = useSelector((state) => state.room.mute);
  const isMuted = isMutedLocally || isMutedGlobally;

  const containerClasses = classNames(
    "UserReactions",
    `UserReactions--reaction-${reactionPosition}`
  );

  // TODO: refactor this to be more performant and potentially memo it if required
  return (
    <div className={containerClasses}>
      {AllReactions.map(
        (reaction, index) =>
          reactions.find(
            (r) => r.created_by === user.id && r.reaction === reaction.type
          ) && (
            // TODO: don't use index as a key
            // TODO: should we extract reactions into their own sub-components?
            // TODO: is reaction-container even defined in our styles here..?
            <React.Fragment key={index}>
              <div
                className="UserReactions__reaction"
                role="img"
                aria-label={reaction.ariaLabel}
              >
                {reaction.text}
              </div>

              {/* TODO: replace this with useSound or similar */}
              {!isMuted && (
                <audio autoPlay loop>
                  <source src={reaction.audioPath} />
                </audio>
              )}
            </React.Fragment>
          )
      )}

      {userShoutout && (
        <div className="UserReactions__shout">{userShoutout.text}</div>
      )}
    </div>
  );
};
