import { useUser } from "../../../../hooks/useUser";
import { UserAvatar } from "../../../atoms/UserAvatar";
import { ProfileModalBasicTextInfo } from "../ProfileModalBasicTextInfo/ProfileModalBasicTextInfo";
import "./ProfileModalContentBasicInfo.scss";
import React from "react";

interface Props {}

export const ProfileModalContentBasicInfo: React.FC<Props> = (props: Props) => {
  const { userWithId } = useUser();

  return (
    <div className="ProfileModalBasicInfo">
      <UserAvatar user={userWithId} size="profileModal" showStatus={true} />
      <ProfileModalBasicTextInfo containerClassName="ProfileModalBasicInfo__text-info" />
    </div>
  );
};
