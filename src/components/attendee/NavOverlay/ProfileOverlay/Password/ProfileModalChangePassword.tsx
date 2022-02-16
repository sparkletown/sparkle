import React, { useCallback } from "react";
import { FieldErrors, useForm } from "react-hook-form";

import { UserProfileModalFormData } from "types/profileModal";
import { ContainerClassName } from "types/utility";

import { userProfileModalFormProp as formProp } from "utils/propName";

import { InputField } from "components/atoms/InputField";

import styles from "./ProfileModalChangePassword.module.scss";

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
    (newPassword: string) => {
      const oldPassword = getValues(formProp("oldPassword"));
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
      const newPassword = getValues(formProp("newPassword"));
      return newPassword
        ? confirmNewPassword === newPassword || "The passwords do not match"
        : undefined;
    },
    [getValues]
  );

  return (
    <div className={containerClassName}>
      <div>Change password</div>
      <div className={styles.ProfileModalChangePassword__input}>
        <span className={styles.ProfileModalChangePassword__title}>
          Old Password
        </span>
        <InputField
          name={formProp("oldPassword")}
          placeholder={"••••••••••"}
          inputClassName={styles.ProfileModalChangePassword__field}
          error={errors?.oldPassword}
          type="password"
          ref={register()}
        />
      </div>
      <div className={styles.ProfileModalChangePassword__input}>
        <span className={styles.ProfileModalChangePassword__title}>
          New Password
        </span>
        <InputField
          name={formProp("newPassword")}
          inputClassName={styles.ProfileModalChangePassword__field}
          error={errors?.newPassword}
          type="password"
          ref={register({ validate: newPasswordValidation })}
        />
      </div>
      <div className={styles.ProfileModalChangePassword__input}>
        <span className={styles.ProfileModalChangePassword__title}>
          Confirm New Password
        </span>
        <InputField
          name={formProp("confirmNewPassword")}
          inputClassName={styles.ProfileModalChangePassword__field}
          error={errors?.confirmNewPassword}
          type="password"
          ref={register({ validate: confirmNewPasswordValidation })}
        />
      </div>
    </div>
  );
};
