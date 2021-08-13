import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { Button } from "components/atoms/Button";

import "./UserProfileModalButtons.scss";

export interface UserProfileModalButtonsProps extends ContainerClassName {
  onCancelClick: () => void;
  isSubmitting: boolean;
}

export const UserProfileModalButtons: React.FC<UserProfileModalButtonsProps> = ({
  onCancelClick,
  containerClassName,
  isSubmitting,
}) => {
  return (
    <div className={containerClassName}>
      <Button
        customClass={classNames("UserProfileModalButtons__button", {
          "UserProfileModalButtons__button--disabled": isSubmitting,
        })}
        disabled={isSubmitting}
        onClick={onCancelClick}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        customClass={classNames(
          "UserProfileModalButtons__button",
          "UserProfileModalButtons__button--primary",
          {
            "UserProfileModalButtons__button--disabled": isSubmitting,
          }
        )}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
};
