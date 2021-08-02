import { Button } from "components/atoms/Button";
import { profileModalWideButtonCustomStyle } from "components/organisms/NewProfileModal/ProfileModal";
import React, { useMemo } from "react";
import { ContainerClassName } from "types/utility";
import "./ProfileModalEditButtons.scss";

interface Props extends ContainerClassName {
  onCancelClick: () => void;
  onSaveClick: () => void;
  saveChangesDisabled?: boolean;
}

const cancelCustomStyle = {
  backgroundColor: "#ffffff33",
  ...profileModalWideButtonCustomStyle,
};

export const ProfileModalEditButtons: React.FC<Props> = ({
  onCancelClick,
  onSaveClick,
  saveChangesDisabled,
  containerClassName,
}: Props) => {
  const saveChangesCustomStyle = useMemo(
    () =>
      saveChangesDisabled
        ? {
            backgroundColor: "#ffffff1a",
            color: "#ffffff66",
            ...profileModalWideButtonCustomStyle,
          }
        : profileModalWideButtonCustomStyle,
    [saveChangesDisabled]
  );

  return (
    <div className={containerClassName}>
      <Button
        customClass={"ProfileModalEditButtons__button"}
        customStyle={cancelCustomStyle}
        onClick={onCancelClick}
      >
        Cancel
      </Button>
      <Button
        customClass={"ProfileModalEditButtons__button"}
        customStyle={saveChangesCustomStyle}
        onClick={onSaveClick}
        disabled={saveChangesDisabled}
      >
        Save changes
      </Button>
    </div>
  );
};
