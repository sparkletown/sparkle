import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";

import { UserProfileMode } from "../ProfilePopoverContent";

import "./EditPasswordForm.scss";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface EditPasswordFormProps {
  setUserProfileMode: (value: UserProfileMode) => void;
}

export const EditPasswordForm: React.FunctionComponent<EditPasswordFormProps> = ({
  setUserProfileMode,
}) => {
  const firebase = useFirebase();
  const user = firebase.auth().currentUser;
  const { register, handleSubmit, errors, watch } = useForm<ChangePasswordData>(
    {
      mode: "onSubmit",
      reValidateMode: "onSubmit",
    }
  );

  const onSubmit = async (data: ChangePasswordData) => {
    if (!user) return;
    user.updatePassword(data.confirmNewPassword);
    setUserProfileMode(UserProfileMode.DEFAULT);
  };

  const verifyCurrentPassword = async (value: string) => {
    if (!user?.email) return;
    try {
      await firebase.auth().signInWithEmailAndPassword(user.email, value);
      return;
    } catch {
      return "Incorrect password";
    }
  };

  const newPassword = watch("newPassword");

  const cancelEdition = useCallback(
    () => setUserProfileMode(UserProfileMode.DEFAULT),
    [setUserProfileMode]
  );

  return (
    <div className="EditPasswordForm">
      <h2 className="EditPasswordForm__title">Change password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <input
          name="currentPassword"
          type="password"
          className="EditPasswordForm__input-block input-centered EditPasswordForm__current-password-input"
          placeholder="Current password"
          ref={register({
            required: true,
            validate: async (value) => await verifyCurrentPassword(value),
          })}
        />
        {errors.currentPassword &&
          errors.currentPassword.type === "required" && (
            <div className="EditPasswordForm__input-error">
              Current password is required
            </div>
          )}
        {errors.currentPassword &&
          errors.currentPassword.type === "validate" && (
            <div className="EditPasswordForm__input-error">
              Invalid password
            </div>
          )}
        <input
          name="newPassword"
          type="password"
          className="EditPasswordForm__input-block input-centered"
          placeholder="New password"
          ref={register({
            required: true,
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{2,}$/,
          })}
        />
        <input
          name="confirmNewPassword"
          type="password"
          className="EditPasswordForm__input-block input-centered"
          placeholder="Confirm password"
          ref={register({
            validate: (value) =>
              value === newPassword || "The passwords do not match",
            required: true,
          })}
        />
        {errors.confirmNewPassword && (
          <div className="EditPasswordForm__input-error">
            Passwords do not match
          </div>
        )}
        <div
          className={`input-${
            errors.newPassword && errors.newPassword.type === "pattern"
              ? "error"
              : "info"
          }`}
        >
          Password must contain letters and numbers
        </div>
        <input
          className="btn btn-primary btn-block btn-centered"
          type="submit"
          value="Save changes"
        />
      </form>
      <button className="button--a" onClick={cancelEdition}>
        Cancel
      </button>
    </div>
  );
};
