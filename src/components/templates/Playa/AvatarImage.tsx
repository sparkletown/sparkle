import React, { useEffect, useState } from "react";
import {
  USE_RANDOM_AVATAR,
  RANDOM_AVATARS,
  DEFAULT_PROFILE_IMAGE,
  DEFAULT_PARTY_NAME,
} from "../../../settings";
import { WithId } from "../../../utils/id";
import { User } from "../../../types/User";

interface PropsType {
  user: WithId<User>;
  useProfilePicture?: boolean;
}

const AvatarImage: React.FC<PropsType> = ({ user, useProfilePicture }) => {
  const [pictureUrl, setPictureUrl] = useState(user.pictureUrl);
  useEffect(() => {
    if (useProfilePicture) {
      return;
    }
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
  }, [user.pictureUrl, user.id, user.anonMode, useProfilePicture]);

  return (
    <img
      className="profile-image"
      src={pictureUrl}
      alt={user.anonMode ? DEFAULT_PARTY_NAME : user.partyName}
      title={user.anonMode ? DEFAULT_PARTY_NAME : user.partyName}
    />
  );
};

AvatarImage.defaultProps = {
  useProfilePicture: false,
};

export default AvatarImage;
