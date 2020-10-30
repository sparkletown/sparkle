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
  DEFAULT_PARTY_NAME,
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

  const randomAvatarUrl = (id: string) =>
    "/avatars/" +
    RANDOM_AVATARS[Math.floor(id?.charCodeAt(0) % RANDOM_AVATARS.length)];

  const avatarUrl = useCallback(
    (id: string, anonMode?: boolean, pictureUrl?: string) => {
      if (anonMode) {
        return setPictureUrl(DEFAULT_PROFILE_IMAGE);
      }

      if (miniAvatars && pictureUrl) {
        return setPictureUrl(pictureUrl);
      }

      if (USE_RANDOM_AVATAR || !pictureUrl) {
        return setPictureUrl(randomAvatarUrl(id));
      }

      return setPictureUrl(DEFAULT_PROFILE_IMAGE);
    },
    [miniAvatars]
  );

  useEffect(() => {
    avatarUrl(user.id, user.anonMode, user.pictureUrl);
  }, [avatarUrl, user.anonMode, user.id, user.pictureUrl]);

  const typedReaction = experienceContext?.reactions ?? [];

  const messagesToBand = typedReaction.find(
    (r) => r.reaction === "messageToTheBand" && r.created_by === user.id
  ) as MessageToTheBandReaction | undefined;

  const imageErrorHandler = useCallback(
    (
      event: HTMLImageElement | React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
      const randomAvatar = randomAvatarUrl(user.id);
      setPictureUrl(randomAvatar);

      (event as HTMLImageElement).onerror = null;
      (event as HTMLImageElement).src = randomAvatar;
    },
    [user.id]
  );

  return useMemo(() => {
    return (
      <div className="profile-picture-container">
        {/* Hidden image, used to handle error if image is not loaded */}
        <img
          src={pictureUrl}
          onError={(event) => imageErrorHandler(event)}
          hidden
          style={{ display: "none" }}
          alt={user.anonMode ? DEFAULT_PARTY_NAME : user.partyName}
        />
        <div
          onClick={() => setSelectedUserProfile(user)}
          className={profileStyle}
          style={{
            backgroundImage: `url(${pictureUrl})`,
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
    pictureUrl,
    user,
    profileStyle,
    messagesToBand,
    imageErrorHandler,
    setSelectedUserProfile,
    experienceContext,
    muteReactions,
    isAudioEffectDisabled,
  ]);
};

UserProfilePicture.defaultProps = {
  profileStyle: "profile-icon",
  miniAvatars: false,
};

export default UserProfilePicture;
