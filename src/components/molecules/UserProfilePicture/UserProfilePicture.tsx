import React, { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import { MessageToTheBandReaction, Reactions } from "utils/reactions";
import { WithId } from "utils/id";

import { useSelector } from "hooks/useSelector";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useReactions } from "hooks/useReactions";
import { useVenueId } from "hooks/useVenueId";

import {
  DEFAULT_PARTY_NAME,
  DEFAULT_PROFILE_IMAGE,
  RANDOM_AVATARS,
} from "settings";

import { User } from "types/User";

import "./UserProfilePicture.scss";

const randomAvatarUrl = (id: string) =>
  "/avatars/" +
  RANDOM_AVATARS[Math.floor(id?.charCodeAt(0) % RANDOM_AVATARS.length)];

// TODO: refactor this to accept named props instead of positional args
const avatarUrl = (
  id: string,
  anonMode?: boolean,
  pictureUrl?: string,
  miniAvatars?: boolean
): string => {
  if (anonMode || !id) {
    return DEFAULT_PROFILE_IMAGE;
  }

  if (!miniAvatars && pictureUrl) {
    return pictureUrl;
  }

  // TODO: how is this intended to be used? Why doesn't it use the profile image? It seems to be something set on venue config..
  if (miniAvatars) {
    return randomAvatarUrl(id);
  }

  return DEFAULT_PROFILE_IMAGE;
};

export interface UserProfilePictureProp {
  user: WithId<User>;
  isAudioEffectDisabled?: boolean;
  miniAvatars?: boolean;
  avatarClassName?: string;
  avatarStyle?: object;
  containerStyle?: object;
  reactionPosition?: "left" | "right";
}

// @debt This component should be divided into a few with simpler logic. Also, remove `styled components`
// @debt the UserAvatar component serves a very similar purpose to this, we should unify them as much as possible
export const UserProfilePicture: React.FC<UserProfilePictureProp> = ({
  isAudioEffectDisabled = true,
  miniAvatars = false,
  avatarClassName = "UserProfilePicture__avatar",
  avatarStyle, // TODO: do we need this prop? Can we remove it? Or at least rename it? Only seems to be used in MapPartygoersOverlay
  containerStyle, // TODO: do we need this prop? Can we remove it? Or at least rename it? Only seems to be used in MapPartygoersOverlay
  reactionPosition = "right",
  user,
}) => {
  const venueId = useVenueId();

  const { openUserProfileModal } = useProfileModalControls();

  // TODO: extract this logic into a generic custom reactions component + improve it?
  const reactions = useReactions(venueId);
  // @debt some of the redux patterns exist for this, but I don't believe anything actually uses them/calls this at the moment. Used in MapPartygoersOverlay
  const muteReactions = useSelector((state) => state.room.mute);
  const typedReaction = reactions ?? [];
  const messagesToBand = typedReaction.find(
    (r) => r.reaction === "messageToTheBand" && r.created_by === user.id
  ) as MessageToTheBandReaction | undefined;

  // TODO: I believe we only need this state to support the imageErrorHandler functionality.. can we just remove it?
  const [pictureUrl, setPictureUrl] = useState(
    avatarUrl(user.id, user.anonMode, user.pictureUrl, miniAvatars)
  );
  useEffect(() => {
    setPictureUrl(
      avatarUrl(user.id, user.anonMode, user.pictureUrl, miniAvatars)
    );
  }, [miniAvatars, user.anonMode, user.id, user.pictureUrl]);

  const openProfileModal = useCallback(() => openUserProfileModal(user), [
    openUserProfileModal,
    user,
  ]);

  // // TODO: extract this logic into a generic custom component + improve it?
  // const imageErrorHandler = useCallback(
  //   (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  //     const randomAvatar = randomAvatarUrl(user.id);
  //     setPictureUrl(randomAvatar);
  //
  //     // TODO: this isn't very reacty.. is it even needed..?
  //     // event.currentTarget.onerror = null;
  //     // event.currentTarget.src = randomAvatar;
  //   },
  //   [user.id]
  // );

  const containerClasses = classNames(
    "UserProfilePicture",
    `UserProfilePicture--reaction-${reactionPosition}`
  );

  const avatarClasses = classNames(
    "UserProfilePicture__avatar",
    avatarClassName
  );

  const avatarStyles = useMemo(
    () => ({
      backgroundImage: `url(${pictureUrl})`,
      ...avatarStyle,
    }),
    [avatarStyle, pictureUrl]
  );

  const userDisplayName = user.anonMode ? DEFAULT_PARTY_NAME : user.partyName;

  return (
    <div className={containerClasses} style={containerStyle}>
      {/* TODO: extract this logic into a generic custom component + improve it? Or just remove it entirely? */}
      {/* Hidden image, used to handle error if image is not loaded */}
      {/*<img*/}
      {/*  src={pictureUrl}*/}
      {/*  onError={(event) => imageErrorHandler(event)}*/}
      {/*  hidden*/}
      {/*  style={{ display: "none" }}*/}
      {/*  alt={user.anonMode ? DEFAULT_PARTY_NAME : user.partyName}*/}
      {/*/>*/}

      {/* TODO: can we use src/components/atoms/UserAvatar/UserAvatar.tsx here? Should we? */}
      <div
        role="img"
        aria-label={`${userDisplayName}'s avatar`}
        className={avatarClasses}
        style={avatarStyles}
        onClick={openProfileModal}
      />

      {/* TODO: refactor this to be more performant and potentially memo it if required */}
      <div className="UserProfilePicture__reaction-container">
        {Reactions.map(
          (reaction, index) =>
            reactions.find(
              (r) => r.created_by === user.id && r.reaction === reaction.type
            ) && (
              // TODO: don't use index as a key
              // TODO: should we extract reactions into their own sub-components?
              // TODO: is reaction-container even defined in our styles here..?
              <React.Fragment key={index}>
                <div
                  className="UserProfilePicture__reaction"
                  role="img"
                  aria-label={reaction.ariaLabel}
                >
                  {reaction.text}
                </div>

                {/* TODO: replace this with useSound or similar */}
                {!muteReactions && !isAudioEffectDisabled && (
                  <audio autoPlay loop>
                    <source src={reaction.audioPath} />
                  </audio>
                )}
              </React.Fragment>
            )
        )}

        {messagesToBand && (
          <div className="UserProfilePicture__shout">{messagesToBand.text}</div>
        )}
      </div>
    </div>
  );
};

/**
 * @deprecated Prefer using named exports instead of default exports
 */
export default UserProfilePicture;
