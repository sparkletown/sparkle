import React, { useCallback } from "react";
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
  const { isShown, show, hide } = useShowHide();

  const pickColor = useCallback(
    (value: ColorResult) => {
      onPickColor && onPickColor(value.hex);
      hide();
    },
    [hide, onPickColor]
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
          style={{ backgroundColor: userStatus.color }}
          className="UserStatusPanel__picker-icon"
          onClick={isShown ? hide : show}
        >
          <FontAwesomeIcon icon={faEyeDropper} />
        </div>
        {!disabled && (
          <div className="UserStatusPanel__delete-icon" onClick={onDelete}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        )}
      </div>
      {isShown && !disabled && <CirclePicker onChange={pickColor} />}
    </>
  );
};
