import React from "react";
import { SpentTime } from "components/shared/SpentTime";

import { UserWithId } from "types/id";

import { ProfileModalButtons } from "./buttons/ProfileModalButtons";
import { ProfileModalBasicInfo } from "./header/ProfileModalBasicInfo";
import { ProfileModalLinks } from "./links/ProfileModalLinks";

export interface ProfileModalContentProps {
  user: UserWithId;
  onPrimaryButtonClick: () => void;
  onEditMode?: () => void;
  onModalClose: () => void;
}

export const ProfileModalContent: React.FC<ProfileModalContentProps> = ({
  user,
  onPrimaryButtonClick,
  onEditMode,
  onModalClose,
}) => {
  return (
    <div data-bem="ProfileModalContent">
      <div className="sm:flex sm:items-start">
        <div>
          <ProfileModalBasicInfo user={user} />
          <ProfileModalLinks user={user} />
          <SpentTime userId={user.id} />
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <ProfileModalButtons
          onClick={onPrimaryButtonClick}
          onEdit={onEditMode}
          onModalClose={onModalClose}
          userId={user.id}
        />
      </div>
    </div>
  );
};
