import React from "react";
import { Button } from "components/atoms/Button";

import {
  profileModalWideButtonCustomStyle,
  profileModalWideButtonCustomStyleDisabled,
  profileModalWideButtonCustomStyleGrey,
} from "types/profileModal";
import { ContainerClassName } from "types/utility";

import "./UserProfileModalButtons.scss";

interface Props extends ContainerClassName {
  onCancelClick: () => void;
  isSubmitting: boolean;
}

export const UserProfileModalButtons: React.FC<Props> = ({
  onCancelClick,
  containerClassName,
  isSubmitting,
}: Props) => {
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
