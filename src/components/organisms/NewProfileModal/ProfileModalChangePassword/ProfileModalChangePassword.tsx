import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/ProfileModalSectionHeader/ProfileModalSectionHeader";
import React from "react";
import { ContainerClassName } from "types/utility";
import "./ProfileModalChangePassword.scss";

interface Props extends ContainerClassName {}

export const ProfileModalChangePassword: React.FC<Props> = ({
  containerClassName,
}: Props) => {
  return (
    <div className={containerClassName}>
      <ProfileModalSectionHeader text="Change password" />
      <input
        className="ProfileModalChangePassword__input ProfileModal__input ProfileModal__input--condensed"
        placeholder="Old Password"
      />
      <input
        className="ProfileModalChangePassword__input ProfileModal__input ProfileModal__input--condensed"
        placeholder="New Password"
      />
      <input
        className="ProfileModalChangePassword__input ProfileModal__input ProfileModal__input--condensed"
        placeholder="Confirm New Password"
      />
    </div>
  );
};
