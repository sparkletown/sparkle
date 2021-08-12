import React, { useCallback } from "react";
import { FieldErrors, useForm } from "react-hook-form";

import { UserProfileModalFormData } from "types/profileModal";
import { ContainerClassName } from "types/utility";

import { userProfileModalFormProp as formProp } from "utils/propName";

import { ProfileModalInput } from "../ProfileModalInput";
import { ProfileModalSectionHeader } from "../ProfileModalSectionHeader";

import "./ProfileModalChangePassword.scss";

export interface ProfileModalChangePasswordProps
  extends ContainerClassName,
    Pick<ReturnType<typeof useForm>, "register" | "getValues"> {
  errors?: Pick<
    FieldErrors<UserProfileModalFormData>,
    "oldPassword" | "newPassword" | "confirmNewPassword"
  >;
}

export const ProfileModalChangePassword: React.FC<ProfileModalChangePasswordProps> = ({
  containerClassName,
  register,
  getValues,
  errors,
}) => {
  const newPasswordValidation = useCallback(
    (password: string) => {
      if (getValues(formProp("oldPassword")) && !password)
        return "New Password cannot by empty";

      if (!password) return;

      if (password.length <= 2)
        return "Password must be at least 2 symbols long";

      if (!/^(?=.*[0-9])(?=.*[a-zA-Z]).{2,}$/.test(password))
        return "Password must contain letters and numbers";
    },
    [getValues]
  );

  const confirmNewPasswordValidation = useCallback(
    (password: string) => {
      const newPassword = getValues(formProp("newPassword"));
      return newPassword
        ? password === newPassword || "The passwords do not match"
        : undefined;
    },
    [getValues]
  );

  return (
    <div className={containerClassName}>
      <ProfileModalSectionHeader text="Change password" />
      <ProfileModalInput
        name={formProp("oldPassword")}
        containerClassName="ProfileModalChangePassword__input"
        placeholder="Old Password"
        error={errors?.oldPassword}
        type="password"
        ref={register()}
      />
      <ProfileModalInput
        name={formProp("newPassword")}
        containerClassName="ProfileModalChangePassword__input"
        placeholder="New Password"
        error={errors?.newPassword}
        type="password"
        ref={register({ validate: newPasswordValidation })}
      />
      <ProfileModalInput
        name={formProp("confirmNewPassword")}
        containerClassName="ProfileModalChangePassword__input"
        placeholder="Confirm New Password"
        error={errors?.confirmNewPassword}
        type="password"
        ref={register({ validate: confirmNewPasswordValidation })}
      />
    </div>
  );
};
