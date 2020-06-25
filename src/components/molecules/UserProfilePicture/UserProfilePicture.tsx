import React, { useContext } from "react";
import { User } from "types/User";

import {
  ExperienceContext,
  ReactionType,
} from "components/context/ExperienceContext";
import "./UserProfilePicture.scss";

type UserProfilePictureProp = {
  user: User;
  setSelectedUserProfile: (user: User) => void;
  imageSize: number;
};

// https://css-tricks.com/hearts-in-html-and-css/
const Heart = () => (
  <svg className="heart reaction" viewBox="0 0 32 29.6">
    <path
      d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
	c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
    />
  </svg>
);

const UserProfilePicture: React.FC<UserProfilePictureProp> = ({
  user,
  setSelectedUserProfile,
  imageSize,
}) => {
  const experienceContext = useContext(ExperienceContext);

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
      {experienceContext &&
        experienceContext.reactions.find(
          (r) => r.created_by === user.id && r.reaction === ReactionType.heart
        ) && (
          <>
            <Heart />
            <audio autoPlay loop>
              <source src="/sounds/woo.mp3" />
            </audio>
          </>
        )}
      {experienceContext &&
        experienceContext.reactions.find(
          (r) => r.created_by === user.id && r.reaction === ReactionType.clap
        ) && (
          <>
            <span className="reaction clap" role="img" aria-label="clap emoji">
              👏
            </span>
            <audio autoPlay loop>
              <source src="/sounds/clap.mp3" />
            </audio>
          </>
        )}
    </div>
  );
};

export default UserProfilePicture;
