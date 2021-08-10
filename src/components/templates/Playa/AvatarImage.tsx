import React, { useEffect, useState } from "react";

import {
  DEFAULT_PARTY_NAME,
  DEFAULT_PROFILE_IMAGE,
  RANDOM_AVATARS,
} from "../../../settings";

import { User } from "../../../types/User";
import { WithId } from "../../../utils/id";

interface PropsType {
  user: WithId<User>;
  useProfilePicture?: boolean;
}

const AvatarImage: React.FC<PropsType> = ({ user, useProfilePicture }) => {
  const [pictureUrl, setPictureUrl] = useState("");
  useEffect(() => {
    if (user.anonMode) {
      setPictureUrl(DEFAULT_PROFILE_IMAGE);
    } else if (!useProfilePicture || !user.pictureUrl) {
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
