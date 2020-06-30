import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { User } from "types/User";

import {
  ExperienceContext,
  Reactions,
  Reaction,
  isMessageToTheBand,
} from "components/context/ExperienceContext";
import "./UserProfilePicture.scss";

type UserProfilePictureProp = {
  user: User;
  setSelectedUserProfile: (user: User) => void;
  imageSize: number;
  isAudioEffectDisabled?: boolean;
};

const UserProfilePicture: React.FC<UserProfilePictureProp> = ({
  user,
  setSelectedUserProfile,
  imageSize,
  isAudioEffectDisabled,
}) => {
  const experienceContext = useContext(ExperienceContext);
  const { muteReactions } = useSelector((state: any) => ({
    muteReactions: state.muteReactions,
  }));

  const typedReaction = (experienceContext
    ? experienceContext.reactions
    : []) as Reaction[];

  const messagesToBand = typedReaction
    .filter(isMessageToTheBand)
    .find((r) => r.created_by === user.id && r.reaction === "messageToTheBand");

  return (
    <div className="profile-picture-container">
      <img
        onClick={() => setSelectedUserProfile(user)}
        key={user.id}
        className="profile-icon"
        src={user.pictureUrl || "/anonymous-profile-icon.jpeg"}
        title={user.partyName}
        alt={`${user.partyName} profile`}
        width={imageSize}
        height={imageSize}
      />
      {Reactions.map(
        (reaction) =>
          experienceContext &&
          experienceContext.reactions.find(
            (r) => r.created_by === user.id && r.reaction === reaction.type
          ) && (
            <div className="reaction-container">
              <span
                className={"reaction " + reaction.name}
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
          <span
            className={"reaction messageToBand"}
            role="img"
            aria-label={"messageToTheBand"}
          >
            {messagesToBand.text}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserProfilePicture;
