import React from "react";

import {
  profileModalWideButtonCustomStyle,
  profileModalWideButtonCustomStyleDisabled,
  profileModalWideButtonCustomStyleGrey,
} from "types/profileModal";
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
        customClass={"UserProfileModalButtons__button"}
        customStyle={
          isSubmitting
            ? profileModalWideButtonCustomStyleDisabled
            : profileModalWideButtonCustomStyleGrey
        }
        disabled={isSubmitting}
        onClick={onCancelClick}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        customClass={"UserProfileModalButtons__button"}
        customStyle={
          isSubmitting
            ? profileModalWideButtonCustomStyleDisabled
            : profileModalWideButtonCustomStyle
        }
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
};
