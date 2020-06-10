import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./ChangePasswordModal.scss";
import { useFirebase } from "react-redux-firebase";

interface PropsType {
  show: boolean;
  onHide: () => void;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePasswordModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
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
    onHide();
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

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body className="change-password-modal">
        <h2 className="title">Change password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <input
            name="currentPassword"
            type="password"
            className="input-block input-centered current-password-input"
            placeholder="Current password"
            ref={register({
              required: true,
              validate: async (value) => await verifyCurrentPassword(value),
            })}
          />
          {errors.currentPassword &&
            errors.currentPassword.type === "required" && (
              <div className="input-error">Current password is required</div>
            )}
          {errors.currentPassword &&
            errors.currentPassword.type === "validate" && (
              <div className="input-error">Invalid password</div>
            )}
          <input
            name="newPassword"
            type="password"
            className="input-block input-centered"
            placeholder="New password"
            ref={register({
              required: true,
              pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{2,}$/,
            })}
          />
          <input
            name="confirmNewPassword"
            type="password"
            className="input-block input-centered"
            placeholder="Confirm password"
            ref={register({
              validate: (value) =>
                value === newPassword || "The passwords do not match",
              required: true,
            })}
          />
          {errors.confirmNewPassword && (
            <div className="input-error">Passwords do not match</div>
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
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
