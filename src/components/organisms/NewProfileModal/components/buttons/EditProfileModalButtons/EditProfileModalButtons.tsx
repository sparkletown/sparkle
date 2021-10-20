import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { Button } from "components/atoms/Button";

import "./EditProfileModalButtons.scss";

export interface UserProfileModalButtonsProps extends ContainerClassName {
  onCancelClick: () => void;
  isSubmitting: boolean;
}

export const EditProfileModalButtons: React.FC<UserProfileModalButtonsProps> = ({
  onCancelClick,
  containerClassName,
  isSubmitting,
}) => {
  return (
    <div className={containerClassName}>
      <Button
        customClass={classNames("EditProfileModalButtons__button", {
          "EditProfileModalButtons__button--disabled": isSubmitting,
        })}
        disabled={isSubmitting}
        onClick={onCancelClick}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        customClass={classNames(
          "EditProfileModalButtons__button",
          "EditProfileModalButtons__button--primary",
          {
            "EditProfileModalButtons__button--disabled": isSubmitting,
          }
        )}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
};
