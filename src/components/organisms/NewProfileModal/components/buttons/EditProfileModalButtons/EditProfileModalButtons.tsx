import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./EditProfileModalButtons.scss";

export interface UserProfileModalButtonsProps extends ContainerClassName {
  onCancelClick: () => void;
  onChangePasswordClick: () => void;
  isChangePasswordShown: boolean;
  isSubmitting: boolean;
}

export const EditProfileModalButtons: React.FC<UserProfileModalButtonsProps> = ({
  onCancelClick,
  onChangePasswordClick,
  isChangePasswordShown,
  containerClassName,
  isSubmitting,
}) => {
  return (
    <div className={classNames("EditProfileModalButtons", containerClassName)}>
      {isChangePasswordShown && (
        <ButtonNG
          variant="secondary"
          className="EditProfileModalButtons__button"
          onClick={onChangePasswordClick}
        >
          Change Password
        </ButtonNG>
      )}
      <ButtonNG
        className="EditProfileModalButtons__button"
        variant="secondary"
        disabled={isSubmitting}
        onClick={onCancelClick}
      >
        Cancel
      </ButtonNG>
      <ButtonNG
        type="submit"
        className="EditProfileModalButtons__button"
        variant="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </ButtonNG>
    </div>
  );
};
