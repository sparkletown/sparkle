import React, { useCallback } from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "components/admin/Input";

import { UserProfileModalFormData } from "types/profileModal";

import { ProfileModalSectionHeader } from "./ProfileModalSectionHeader";

export interface ProfileModalChangePasswordProps {
  errors?: Pick<
    FieldErrors<UserProfileModalFormData>,
    "oldPassword" | "newPassword" | "confirmNewPassword"
  >;
  register: UseFormRegister<UserProfileModalFormData>;
  getValues: UseFormGetValues<UserProfileModalFormData>;
}

export const ProfileModalChangePassword: React.FC<ProfileModalChangePasswordProps> = ({
  register,
  getValues,
  errors,
}) => {
  const newPasswordValidation = useCallback(
    (newPassword: string) => {
      const oldPassword = getValues("oldPassword");
      if (oldPassword && !newPassword) return "New Password cannot by empty";

      if (!oldPassword && !newPassword) return;

      if (newPassword.length <= 2)
        return "Password must be at least 2 symbols long";

      if (!/^(?=.*[0-9])(?=.*[a-zA-Z]).{2,}$/.test(newPassword))
        return "Password must contain letters and numbers";
    },
    [getValues]
  );

  const confirmNewPasswordValidation = useCallback(
    (confirmNewPassword: string) => {
      const newPassword = getValues("newPassword");
      return newPassword
        ? confirmNewPassword === newPassword || "The passwords do not match"
        : undefined;
    },
    [getValues]
  );

  return (
    <div data-bem="ProfileModalChangePassword">
      <ProfileModalSectionHeader text="Change password" />
      <Input
        placeholder="Old Password"
        error={errors?.oldPassword}
        type="password"
        name={"oldPassword"}
        register={register}
      />
      <Input
        placeholder="New Password"
        error={errors?.newPassword}
        type="password"
        name="newPassword"
        register={register}
        rules={{ validate: newPasswordValidation }}
      />
      <Input
        placeholder="Confirm New Password"
        error={errors?.confirmNewPassword}
        type="password"
        register={register}
        rules={{
          validate: confirmNewPasswordValidation,
        }}
        name="confirmNewPassword"
      />
    </div>
  );
};
