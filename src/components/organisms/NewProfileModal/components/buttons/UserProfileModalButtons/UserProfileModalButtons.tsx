import { Button } from "components/atoms/Button";
import {
  profileModalWideButtonCustomStyle,
  profileModalWideButtonCustomStyleGrey,
} from "components/organisms/NewProfileModal/utilities";
import React, { useMemo } from "react";
import { ContainerClassName } from "types/utility";
import "./UserProfileModalButtons.scss";

interface Props extends ContainerClassName {
  onCancelClick: () => void;
  saveChangesDisabled?: boolean;
}

export const UserProfileModalButtons: React.FC<Props> = ({
  onCancelClick,
  saveChangesDisabled,
  containerClassName,
}: Props) => {
  const saveChangesCustomStyle = useMemo(
    () =>
      saveChangesDisabled
        ? {
            color: "#ffffff66",
            ...profileModalWideButtonCustomStyle,
            backgroundColor: "#ffffff1a",
          }
        : profileModalWideButtonCustomStyle,
    [saveChangesDisabled]
  );

  return (
    <div className={containerClassName}>
      <Button
        customClass={"UserProfileModalButtons__button"}
        customStyle={profileModalWideButtonCustomStyleGrey}
        onClick={onCancelClick}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        customClass={"UserProfileModalButtons__button"}
        customStyle={saveChangesCustomStyle}
        disabled={saveChangesDisabled}
      >
        Save changes
      </Button>
    </div>
  );
};
