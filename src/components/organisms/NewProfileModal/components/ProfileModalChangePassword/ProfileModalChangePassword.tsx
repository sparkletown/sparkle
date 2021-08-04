import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/components/ProfileModalSectionHeader/ProfileModalSectionHeader";
import { formProp } from "components/organisms/NewProfileModal/utility";
import React from "react";
import { FormFieldProps } from "types/forms";
import { ContainerClassName } from "types/utility";
import "components/organisms/NewProfileModal/components/ProfileModalChangePassword/ProfileModalChangePassword.scss";
import { ProfileModalInput } from "../ProfileModalInput/ProfileModalInput";

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
      <ProfileModalInput
        name={formProp("oldPassword")}
        containerClassName="ProfileModalChangePassword__input"
        placeholder="Old Password"
        ref={register()}
      />
      <ProfileModalInput
        name={formProp("newPassword")}
        containerClassName="ProfileModalChangePassword__input"
        placeholder="New Password"
        ref={register()}
      />
      <ProfileModalInput
        name={formProp("confirmNewPassword")}
        containerClassName="ProfileModalChangePassword__input"
        placeholder="Confirm New Password"
        ref={register()}
      />
    </div>
  );
};
