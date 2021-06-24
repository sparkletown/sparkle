import React, { useCallback, useMemo } from "react";
import { CirclePicker, ColorResult } from "react-color";
import { faEyeDropper, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserStatus } from "types/User";

import { useShowHide } from "hooks/useShowHide";

import { InputField } from "components/atoms/InputField";

import "./UserStatusPanel.scss";

export interface UserStatusPanelProps {
  userStatus: UserStatus;
  disabled?: boolean;
  onDelete?: () => void;
  onPickColor?: (color: string) => void;
  onChangeInput?: (value: React.FormEvent<HTMLInputElement>) => void;
}

export const UserStatusPanel: React.FC<UserStatusPanelProps> = ({
  userStatus,
  disabled = false,
  onDelete,
  onPickColor,
  onChangeInput,
}) => {
  const {
    isShown: isColorPickerShown,
    hide: hideColorPicker,
    toggle: toggleColorPicker,
  } = useShowHide();

  const pickColor = useCallback(
    (value: ColorResult) => {
      onPickColor && onPickColor(value.hex);
      hideColorPicker();
    },
    [hideColorPicker, onPickColor]
  );

  const statusIndicatorStyles = useMemo(
    () => ({ backgroundColor: userStatus.color }),
    [userStatus.color]
  );

  return (
    <>
      <div className="UserStatusPanel__status">
        <InputField
          value={userStatus.status}
          onChange={onChangeInput}
          disabled={disabled}
        />
        <div
          style={statusIndicatorStyles}
          className="UserStatusPanel__picker-icon"
          onClick={toggleColorPicker}
        >
          <FontAwesomeIcon icon={faEyeDropper} />
        </div>
        {!disabled && (
          <div className="UserStatusPanel__delete-icon" onClick={onDelete}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        )}
      </div>
      {isColorPickerShown && !disabled && <CirclePicker onChange={pickColor} />}
    </>
  );
};
