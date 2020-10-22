import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Typings
import { User } from "types/User";

// Components
import {
  ExperienceContext,
  MessageToTheBandReaction,
  Reactions,
} from "components/context/ExperienceContext";

// Hooks
import { useSelector } from "hooks/useSelector";

// Utils | Settings
import { WithId } from "utils/id";
import {
  DEFAULT_PROFILE_IMAGE,
  RANDOM_AVATARS,
  USE_RANDOM_AVATAR,
} from "settings";

// Styles
import "./UserProfilePicture.scss";

type UserProfilePictureProp = {
  isAudioEffectDisabled?: boolean;
  miniAvatars?: boolean;
  profileStyle?: string;
  setSelectedUserProfile: (user: WithId<User>) => void;
  user: WithId<User>;
};

const UserProfilePicture: React.FC<UserProfilePictureProp> = ({
  isAudioEffectDisabled,
  miniAvatars,
  profileStyle,
  setSelectedUserProfile,
  user,
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

  // This can be removed as the pictureUrl is already being set in the useEffect
  const avatarSrc = useCallback(() => {
    if (miniAvatars) return pictureUrl;

    if (!user.anonMode) return user.pictureUrl;

    return DEFAULT_PROFILE_IMAGE;
  }, [miniAvatars, pictureUrl, user.anonMode, user.pictureUrl]);

  return useMemo(() => {
    return (
      <div className="profile-picture-container">
        <div
          onClick={() => setSelectedUserProfile(user)}
          className={profileStyle}
          style={{
            backgroundImage: `url(${avatarSrc()})`, // this should be `pictureUrl`
          }}
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
  }, [
    avatarSrc,
    experienceContext,
    isAudioEffectDisabled,
    messagesToBand,
    muteReactions,
    profileStyle,
    setSelectedUserProfile,
    user,
  ]);
};

UserProfilePicture.defaultProps = {
  profileStyle: "profile-icon",
  miniAvatars: false,
};

export default UserProfilePicture;
