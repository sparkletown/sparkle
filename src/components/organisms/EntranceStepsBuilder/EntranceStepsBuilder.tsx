import React from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { EntranceStepConfig } from "types/EntranceStep";

import { AdminSidebarSectionSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionSubTitle";

import { EntranceStepsInputFieldSet } from "components/molecules/EntranceStepsInputFieldSet";
import { FormErrors } from "components/molecules/FormErrors";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./EntranceStepsBuilder.scss";

export interface EntranceStepsBuilderProps {
  items?: EntranceStepConfig[];
  name: string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  title?: string;
  errors?: FieldErrors<FieldValues>;
  onAdd: () => void;
  onClear: () => void;
  onRemove: (context: { index: number }) => void;
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
        // @debt any arbitrary step should be able to be removed, not just the last one
        // NOTE: due to incomplete array/form logic, only last element gets removed, don't provide remove for the rest
        const isLast = count && index === count - 1;
        return (
          <EntranceStepsInputFieldSet
            item={items?.[index]}
            errors={errors?.[index]}
            index={index}
            key={`${name}-${index}`}
            name={name}
            onRemove={isLast ? onRemove : undefined}
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
