import React, { useContext, useEffect, useState } from "react";
import { User } from "types/User";

import {
  ExperienceContext,
  Reactions,
  MessageToTheBandReaction,
} from "components/context/ExperienceContext";
import "./UserProfilePicture.scss";
import {
  DEFAULT_PROFILE_IMAGE,
  USE_RANDOM_AVATAR,
  RANDOM_AVATARS,
  DEFAULT_PARTY_NAME,
} from "settings";
import { useSelector } from "hooks/useSelector";
import { WithId } from "utils/id";

type UserProfilePictureProp = {
  user: WithId<User>;
  setSelectedUserProfile: (user: WithId<User>) => void;
  imageSize: number | undefined;
  profileStyle?: string;
  isAudioEffectDisabled?: boolean;
  miniAvatars?: boolean;
};

const UserProfilePicture: React.FC<UserProfilePictureProp> = ({
  user,
  setSelectedUserProfile,
  imageSize,
  profileStyle,
  isAudioEffectDisabled,
  miniAvatars,
}) => {
  const experienceContext = useContext(ExperienceContext);
  const { muteReactions } = useSelector((state) => ({
    muteReactions: state.room.mute,
  }));

  const [pictureUrl, setPictureUrl] = useState("");
  useEffect(() => {
    if (!user.id) return;
    if (user.anonMode) {
      setPictureUrl(DEFAULT_PROFILE_IMAGE);
    } else if (USE_RANDOM_AVATAR || !user.pictureUrl) {
      const randomUrl =
        "/avatars/" +
        RANDOM_AVATARS[
          Math.floor(user.id.charCodeAt(0) % RANDOM_AVATARS.length)
        ];
      setPictureUrl(randomUrl);
    } else {
      setPictureUrl(user.pictureUrl);
    }
  }, [user.pictureUrl, user.id, user.anonMode]);

  const typedReaction = experienceContext?.reactions ?? [];

  const messagesToBand = typedReaction.find(
    (r) => r.reaction === "messageToTheBand" && r.created_by === user.id
  ) as MessageToTheBandReaction | undefined;

  return (
    <div className="profile-picture-container">
      <img
        onClick={() => setSelectedUserProfile(user)}
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src =
            "/avatars/" +
            RANDOM_AVATARS[
              Math.floor(user.id.charCodeAt(0) % RANDOM_AVATARS.length)
            ];
        }}
        key={user.id}
        className={profileStyle}
        src={
          miniAvatars
            ? pictureUrl
            : (!user.anonMode && user.pictureUrl) || DEFAULT_PROFILE_IMAGE
        }
        alt={user.anonMode ? DEFAULT_PARTY_NAME : user.partyName}
        title={user.anonMode ? DEFAULT_PARTY_NAME : user.partyName}
        width={imageSize}
        height={imageSize}
      />
      {Reactions.map(
        (reaction, index) =>
          experienceContext &&
          experienceContext.reactions.find(
            (r) => r.created_by === user.id && r.reaction === reaction.type
          ) && (
            <div key={index} className="reaction-container">
              <span
                className={`reaction ${reaction.name}`}
                role="img"
                aria-label={reaction.ariaLabel}
              >
                {reaction.text}
              </span>
              {!muteReactions && !isAudioEffectDisabled && (
                <audio autoPlay loop>
                  <source src={reaction.audioPath} />
                </audio>
              )}
            </div>
          )
      )}
      {messagesToBand && (
        <div className="reaction-container">
          <div
            className="reaction messageToBand"
            role="img"
            aria-label="messageToTheBand"
          >
            {messagesToBand.text}
          </div>
        </div>
      )}
    </div>
  );
};

UserProfilePicture.defaultProps = {
  profileStyle: "profile-icon",
  miniAvatars: false,
};

export default UserProfilePicture;
