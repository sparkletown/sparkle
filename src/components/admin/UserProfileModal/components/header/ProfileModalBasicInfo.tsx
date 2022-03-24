import React from "react";
import { ProfileModalAvatar } from "components/admin/UserProfileModal/components/header/ProfileModalAvatar";
import { ProfileModalBasicTextInfo } from "components/admin/UserProfileModal/components/header/ProfileModalBasicTextInfo";

import { User } from "types/User";

import { WithId } from "utils/id";

import { ModalTitle } from "components/molecules/Modal/ModalTitle";

export interface ProfileModalBasicInfoProps {
  user: WithId<User>;
}

export const ProfileModalBasicInfo: React.FC<ProfileModalBasicInfoProps> = ({
  user,
}) => {
  return (
    <div data-bem="ProfileModalBasicInfo" className="mt-3 text-left sm:mt-0">
      <ModalTitle>My profile</ModalTitle>

      <div
        data-bem="ProfileModalBasicInfo__main-container"
        className="mt-7 mb-5 flex flex-row gap-3"
      >
        <ProfileModalAvatar user={user} editMode={false} />
        <ProfileModalBasicTextInfo user={user} />
      </div>
    </div>
  );
};
