import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import { EntranceStepConfig } from "types/EntranceStep";
import { WorldEntranceFormInput } from "types/world";

import {
  UseArrayAdd,
  UseArrayClear,
  UseArrayRemove,
  UseArrayUpdate,
} from "hooks/useArray";

import { AdminSidebarSectionSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionSubTitle";

import { EntranceStepsInputFieldSet } from "components/molecules/EntranceStepsInputFieldSet";
import { FormErrors } from "components/molecules/FormErrors";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./EntranceStepsBuilder.scss";

export interface EntranceStepsBuilderProps {
  items?: EntranceStepConfig[];
  name: string;
  register: UseFormRegister<WorldEntranceFormInput>;
  title?: string;
  errors?: FieldErrors<FieldValues>;
  onAdd: UseArrayAdd<EntranceStepConfig>;
  onUpdate: UseArrayUpdate<EntranceStepConfig>;
  onClear: UseArrayClear<EntranceStepConfig>;
  onRemove: UseArrayRemove<EntranceStepConfig>;
}

export const EntranceStepsBuilder: React.FC<EntranceStepsBuilderProps> = ({
  items,
  name,
  register,
  title,
  errors,
  onAdd,
  onUpdate,
  onClear,
  onRemove,
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
            onUpdate={onUpdate}
            onRemove={onRemove}
            register={register}
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
