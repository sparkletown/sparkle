import React from "react";
import {
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "components/admin/Button";
import { EntranceButtonsInputFieldSet } from "components/admin/EntranceButtonsInputFieldSet";
import { InputGroupSubtitle } from "components/admin/InputGroupSubtitle";

import { EntranceStepButtonConfig } from "types/EntranceStep";
import { WorldEntranceFormInput } from "types/world";

export interface EntranceButtonsBuilderProps {
  name: string;
  items?: EntranceStepButtonConfig[];
  register: UseFormRegister<WorldEntranceFormInput>;
  title?: string;
  errors?: FieldErrors<FieldValues>;
  onAdd: () => void;
  onClear: () => void;
  onRemove: UseFieldArrayRemove;
}

export const EntranceButtonsBuilder: React.FC<EntranceButtonsBuilderProps> = ({
  items,
  name,
  register,
  title,
  errors,
  onAdd,
  onClear,
  onRemove,
}) => {
  const count = items?.length ?? 0;
  return (
    <div className="EntranceButtonsBuilder">
      {title && <InputGroupSubtitle>{title}</InputGroupSubtitle>}

      {Array.from({ length: count }).map((_, index) => {
        return (
          <EntranceButtonsInputFieldSet
            errors={errors}
            index={index}
            key={`${name}-${index}`}
            name={name}
            onRemove={onRemove}
            register={register}
          />
        );
      })}

      <div className="EntranceButtonsBuilder__buttons">
        <Button variant="primary" onClick={onAdd}>
          Add button
        </Button>
        {count > 0 && (
          <Button variant="danger" onClick={onClear}>
            Remove all buttons
          </Button>
        )}
      </div>
    </div>
  );
};
