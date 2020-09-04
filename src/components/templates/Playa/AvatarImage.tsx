import React, { useEffect, useState } from "react";
import { USE_RANDOM_AVATAR, RANDOM_AVATARS } from "../../../settings";
import { WithId } from "../../../utils/id";
import { User } from "../../../types/User";

interface PropsType {
  user: WithId<User>;
}

const AvatarImage: React.FC<PropsType> = ({ user }) => {
  const [pictureUrl, setPictureUrl] = useState("");
  useEffect(() => {
    if (USE_RANDOM_AVATAR || !user.pictureUrl) {
      const randomUrl =
        "/avatars/" +
        RANDOM_AVATARS[
          Math.floor(user.id.charCodeAt(0) % RANDOM_AVATARS.length)
        ];
      setPictureUrl(randomUrl);
    } else {
      setPictureUrl(user.pictureUrl);
    }
  }, [user]);

  return (
    <img
      className="profile-image"
      src={pictureUrl}
      alt={user.partyName}
      title={user.partyName}
    />
  );
};
export default AvatarImage;
