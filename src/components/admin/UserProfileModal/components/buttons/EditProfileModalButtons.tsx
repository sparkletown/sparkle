import React from "react";
import classNames from "classnames";
import { Button } from "components/admin/Button";

import { ContainerClassName } from "types/utility";

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
        <Button
          variant="secondary"
          className="EditProfileModalButtons__button"
          onClick={onChangePasswordClick}
        >
          Change Password
        </Button>
      )}
      <Button
        className="EditProfileModalButtons__button"
        variant="secondary"
        disabled={isSubmitting}
        onClick={onCancelClick}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="EditProfileModalButtons__button"
        variant="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
};
