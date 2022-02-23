import React, { useCallback } from "react";
import { CirclePicker, ColorResult } from "react-color";
import { faEyeDropper, faTimes } from "@fortawesome/free-solid-svg-icons";

import { UserStatus } from "types/User";

import { useShowHide } from "hooks/useShowHide";

import { AdminInput, AdminInputProps } from "components/molecules/AdminInput";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./AdminUserStatusInput.scss";

export interface AdminUserStatusInputProps
  extends Omit<AdminInputProps, "onChange"> {
  item?: UserStatus;
  onChange?: (status: UserStatus) => void;
  onRemove?: () => void;
}

export const AdminUserStatusInput: React.FC<AdminUserStatusInputProps> = ({
  name,
  item,
  onChange,
  onRemove,
  register,
  ...extraProps
}) => {
  const {
    isShown: isColorPickerShown,
    hide: hideColorPicker,
    toggle: toggleColorPicker,
  } = useShowHide();

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const status = event.currentTarget.value;
      return onChange?.({ status, color: item?.color ?? "" });
    },
    [item, onChange]
  );

  const handleColorChange = useCallback(
    ({ hex }: ColorResult) => {
      onChange?.({ status: item?.status ?? "", color: hex });
      hideColorPicker();
    },
    [item, onChange, hideColorPicker]
  );

  const pickerStyles = { backgroundColor: item?.color };

  const inputStatus = `${name}status`;
  const inputColor = `${name}color`;

  return (
    <span className="AdminUserStatusInput">
      <span className="AdminUserStatusInput__inputs">
        <AdminInput
          {...extraProps}
          className="AdminUserStatusInput__text"
          name={inputStatus}
          register={register}
          onChange={handleTextChange}
        />
        <input
          className="AdminUserStatusInput__color"
          name={inputColor}
          type="hidden"
          ref={register}
        />
        <ButtonNG
          style={pickerStyles}
          onClick={toggleColorPicker}
          iconOnly
          iconName={faEyeDropper}
        />
        <ButtonNG onClick={onRemove} iconOnly iconName={faTimes} />
      </span>
      {isColorPickerShown && (
        <span className="AdminUserStatusInput__picker">
          <CirclePicker onChange={handleColorChange} />
        </span>
      )}
    </span>
  );
};
