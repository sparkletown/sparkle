import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/components/ProfileModalSectionHeader/ProfileModalSectionHeader";
import React from "react";
import { ContainerClassName } from "types/utility";
import "components/organisms/NewProfileModal/components/ProfileModalChangePassword/ProfileModalChangePassword.scss";

interface Props extends ContainerClassName {}

export const ProfileModalChangePassword: React.FC<Props> = ({
  containerClassName,
}: Props) => {
  return (
    <div className={containerClassName}>
      <ProfileModalSectionHeader text="Change password" />
      <input
        className="ProfileModalChangePassword__input"
        placeholder="Old Password"
      />
      <input
        className="ProfileModalChangePassword__input"
        placeholder="New Password"
      />
      <input
        className="ProfileModalChangePassword__input"
        placeholder="Confirm New Password"
      />
    </div>
  );
};
