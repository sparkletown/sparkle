import React, { useState } from "react";

import { useUser } from "hooks/useUser";

import { EditProfileForm } from "./EditProfileForm";
import { UserInformationContent } from "./UserInformationContent";

import "./ProfilePopoverContent.scss";

export enum UserProfileMode {
  DEFAULT,
  EDIT_PROFILE,
  EDIT_PASSWORD,
  EDIT_PROFILE_LINK,
}

export const ProfilePopoverContent: React.FC = () => {
  const [mode, setMode] = useState<UserProfileMode>(UserProfileMode.DEFAULT);

  const { userWithId, user } = useUser();

  return (
    <div className="ProfilePopoverContent">
      {mode === UserProfileMode.DEFAULT && (
        <UserInformationContent
          setUserProfileMode={setMode}
          setProfileLinkToEdit={() => {}}
          user={userWithId}
          email={user?.email}
        />
      )}
      {mode === UserProfileMode.EDIT_PROFILE && (
        <EditProfileForm setUserProfileMode={setMode} />
      )}
    </div>
  );
};
