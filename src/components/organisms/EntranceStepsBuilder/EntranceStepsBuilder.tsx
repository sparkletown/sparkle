import React from "react";
import {
  Control,
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

import { EntranceStepConfig } from "types/EntranceStep";
import { WorldEntranceFormInput } from "types/world";

import { ButtonNG } from "components/atoms/ButtonNG";
import { EntranceStepsInputFieldSet } from "components/molecules/EntranceStepsInputFieldSet";
import { FormErrors } from "components/molecules/FormErrors";
import { AdminSidebarSectionSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionSubTitle";

import "./EntranceStepsBuilder.scss";

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
      {title && (
        <AdminSidebarSectionSubTitle>{title}</AdminSidebarSectionSubTitle>
      )}

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
        <ButtonNG variant="primary" onClick={onAdd}>
          Add entrance step
        </ButtonNG>
        {count > 0 && (
          <ButtonNG variant="danger" onClick={onClear}>
            Remove all steps
          </ButtonNG>
        )}
      </div>
      <FormErrors errors={errors} omitted={handledErrors} />
    </div>
  );
};
