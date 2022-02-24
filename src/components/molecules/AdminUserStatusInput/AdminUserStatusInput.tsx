import React, { useCallback } from "react";
import { CirclePicker, ColorResult } from "react-color";
import { UseFormRegister } from "react-hook-form";
import { faEyeDropper, faTimes } from "@fortawesome/free-solid-svg-icons";

import { UserStatus } from "types/User";
import { WorldAdvancedFormInput } from "types/world";

import { useShowHide } from "hooks/useShowHide";

import { ButtonNG } from "components/atoms/ButtonNG";
import { AdminInput, AdminInputProps } from "components/molecules/AdminInput";

import "./AdminUserStatusInput.scss";

export interface AdminUserStatusInputProps
  extends Omit<AdminInputProps, "onChange" | "name"> {
  item?: UserStatus;
  index: number;
  onChange?: (item: UserStatus) => void;
  onRemove?: () => void;
  register: UseFormRegister<WorldAdvancedFormInput>;
}

export const AdminUserStatusInput: React.FC<AdminUserStatusInputProps> = ({
  item,
  onChange,
  onRemove,
  register,
  index,
  ...extraProps
}) => {
  const {
    isShown: isColorPickerShown,
    hide: hideColorPicker,
    toggle: toggleColorPicker,
  } = useShowHide();

  const handleColorChange = useCallback(
    ({ hex }: ColorResult) => {
      onChange?.({ status: item?.status ?? "", color: hex });
      hideColorPicker();
    },
    [item, onChange, hideColorPicker]
  );

  const pickerStyles = { backgroundColor: item?.color };
  const inputStatus = `userStatuses.${index}.status`;

  return (
    <span className="AdminUserStatusInput">
      <span className="AdminUserStatusInput__inputs">
        <AdminInput
          {...extraProps}
          className="AdminUserStatusInput__text"
          name={inputStatus}
          register={register}
        />
        <input
          className="AdminUserStatusInput__color"
          type="hidden"
          {...register(`userStatuses.${index}.color`)}
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
