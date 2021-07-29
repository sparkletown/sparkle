import { useUser } from "../../../../../hooks/useUser";
import { UserAvatar } from "../../../../atoms/UserAvatar";
import { ProfileModalBasicTextInfo } from "../ProfileModalBasicTextInfo/ProfileModalBasicTextInfo";
import "./ProfileModalBasicInfo.scss";
import React from "react";
import { WithId } from "../../../../../utils/id";
import { User } from "../../../../../types/User";

interface Props {
  user: WithId<User>;
}

export const ProfileModalBasicInfo: React.FC<Props> = ({ user }) => {
  const { userWithId } = useUser();

  return (
    <div className="ProfileModalBasicInfo">
      <UserAvatar
        user={userWithId}
        size="profileModal"
        showStatus={user?.id !== userWithId?.id}
      />
      <ProfileModalBasicTextInfo
        user={user}
        containerClassName="ProfileModalBasicInfo__text-info"
      />
    </div>
  );
};
