import React from "react";
import {
  Control,
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "components/admin/Button";
import { EntranceStepsInputFieldSet } from "components/admin/EntranceStepsInputFieldSet";
import { InputGroupSubtitle } from "components/admin/InputGroupSubtitle";

import { EntranceStepConfig } from "types/EntranceStep";
import { WorldEntranceFormInput } from "types/world";

import { FormErrors } from "components/molecules/FormErrors";

export interface EntranceStepsBuilderProps {
  items?: EntranceStepConfig[];
  name: string;
  register: UseFormRegister<WorldEntranceFormInput>;
  title?: string;
  errors?: FieldErrors<FieldValues>;
  onAdd: () => void;
  onClear: () => void;
  onRemove: UseFieldArrayRemove;
  control: Control<WorldEntranceFormInput, object>;
}

export const EntranceStepsBuilder: React.FC<EntranceStepsBuilderProps> = ({
  items,
  name,
  register,
  title,
  errors,
  onAdd,
  onClear,
  onRemove,
  control,
}) => {
  const count = items?.length ?? 0;
  const handledErrors: string[] = [];

  return (
    <div className="EntranceStepsBuilder">
      {title && <InputGroupSubtitle>{title}</InputGroupSubtitle>}

      {Array.from({ length: count }).map((_, index) => {
        handledErrors.push(`${index}`);
        return (
          <EntranceStepsInputFieldSet
            item={items?.[index]}
            errors={errors?.[index]}
            index={index}
            key={`${name}-${index}`}
            name={name}
            onRemove={onRemove}
            register={register}
            control={control}
          />
        );
      })}

      <div className="EntranceStepsBuilder__buttons">
        <Button variant="primary" onClick={onAdd}>
          Add entrance step
        </Button>
        {count > 0 && (
          <Button variant="danger" onClick={onClear}>
            Remove all steps
          </Button>
        )}
      </div>
      <FormErrors errors={errors} omitted={handledErrors} />
    </div>
  );
};
