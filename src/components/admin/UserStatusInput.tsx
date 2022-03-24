import React, { useCallback } from "react";
import { CirclePicker, ColorResult } from "react-color";
import { UseFormRegister } from "react-hook-form";
import { Button } from "components/admin/Button";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";

import { UserStatus } from "types/User";
import { WorldAdvancedFormInput } from "types/world";

import { useShowHide } from "hooks/useShowHide";

import { AdminInputProps } from "components/molecules/AdminInput";

export interface UserStatusInputProps
  extends Omit<AdminInputProps, "onChange" | "name"> {
  item?: UserStatus;
  index: number;
  onChange?: (item: UserStatus) => void;
  onRemove?: () => void;
  register: UseFormRegister<WorldAdvancedFormInput>;
}

export const UserStatusInput: React.FC<UserStatusInputProps> = ({
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
        <InputGroup withLabel title="Status name">
          <Input
            {...extraProps}
            className="AdminUserStatusInput__text"
            name={inputStatus}
            register={register}
            label="Status name"
          />
          <input
            className="AdminUserStatusInput__color"
            type="hidden"
            {...register(`userStatuses.${index}.color`)}
          />

          <Button style={pickerStyles} onClick={toggleColorPicker}>
            Choose color
          </Button>

          <Button onClick={onRemove} variant="secondary">
            Remove
          </Button>
        </InputGroup>
      </span>
      {isColorPickerShown && (
        <span className="AdminUserStatusInput__picker">
          <CirclePicker onChange={handleColorChange} />
        </span>
      )}
    </span>
  );
};
