import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/components/ProfileModalSectionHeader/ProfileModalSectionHeader";
import { formProp } from "components/organisms/NewProfileModal/UserProfileModal";
import React from "react";
import { FormFieldProps } from "types/forms";
import { ContainerClassName } from "types/utility";
import "components/organisms/NewProfileModal/components/ProfileModalChangePassword/ProfileModalChangePassword.scss";

interface Props extends ContainerClassName {
  register: FormFieldProps["register"];
}

export const ProfileModalChangePassword: React.FC<Props> = ({
  containerClassName,
  register,
}: Props) => {
  return (
    <div className={containerClassName}>
      <ProfileModalSectionHeader text="Change password" />
      <input
        name={formProp("oldPassword")}
        className="ProfileModalChangePassword__input"
        placeholder="Old Password"
        ref={register()}
      />
      <input
        name={formProp("newPassword")}
        className="ProfileModalChangePassword__input"
        placeholder="New Password"
        ref={register()}
      />
      <input
        name={formProp("confirmNewPassword")}
        className="ProfileModalChangePassword__input"
        placeholder="Confirm New Password"
        ref={register()}
      />
    </div>
  );
};
