import React, { useCallback } from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "components/attendee/Input";

import { UserProfileModalFormData } from "types/profileModal";

import styles from "./ProfileModalChangePassword.module.scss";

export interface ProfileModalChangePasswordProps {
  errors?: Pick<
    FieldErrors<UserProfileModalFormData>,
    "oldPassword" | "newPassword" | "confirmNewPassword"
  >;
  getValues: UseFormGetValues<UserProfileModalFormData>;
  register: UseFormRegister<UserProfileModalFormData>;
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
      <div>Change password</div>
      <div className={styles.ProfileModalChangePassword__input}>
        <span className={styles.ProfileModalChangePassword__title}>
          Old Password
        </span>
        <Input
          placeholder={"••••••••••"}
          name="oldPassword"
          register={register}
          inputClassName={styles.ProfileModalChangePassword__field}
          error={errors?.oldPassword}
          type="password"
          autoComplete="off"
        />
      </div>
      <div className={styles.ProfileModalChangePassword__input}>
        <span className={styles.ProfileModalChangePassword__title}>
          New Password
        </span>
        <Input
          name="newPassword"
          inputClassName={styles.ProfileModalChangePassword__field}
          error={errors?.newPassword}
          type="password"
          register={register}
          rules={{ validate: newPasswordValidation }}
        />
      </div>
      <div className={styles.ProfileModalChangePassword__input}>
        <span className={styles.ProfileModalChangePassword__title}>
          Confirm New Password
        </span>
        <Input
          name="confirmNewPassword"
          inputClassName={styles.ProfileModalChangePassword__field}
          error={errors?.confirmNewPassword}
          type="password"
          register={register}
          rules={{ validate: confirmNewPasswordValidation }}
        />
      </div>
    </div>
  );
};
