import React from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { EntranceStepButtonConfig } from "types/EntranceStep";

import { AdminSidebarSectionSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionSubTitle";

import { EntranceButtonsInputFieldSet } from "components/molecules/EntranceButtonsInputFieldSet";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./EntranceButtonsBuilder.scss";

export interface EntranceButtonsBuilderProps {
  name: string;
  hasLink?: boolean;
  items?: EntranceStepButtonConfig[];
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  title?: string;
  errors?: FieldErrors<FieldValues>;
  onAdd: () => void;
  onClear: () => void;
  onRemove: (context: { index: number }) => void;
}

export const EntranceButtonsBuilder: React.FC<EntranceButtonsBuilderProps> = ({
  items,
  name,
  hasLink,
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
      {title && (
        <AdminSidebarSectionSubTitle>{title}</AdminSidebarSectionSubTitle>
      )}

      {Array.from({ length: count }).map((_, index) => {
        // @debt any arbitrary button should be able to be removed, not just the last one
        // NOTE: due to incomplete array/form logic, only last element gets removed, don't provide remove for the rest
        const isLast = count && index === count - 1;
        return (
          <EntranceButtonsInputFieldSet
            errors={errors}
            hasLink={hasLink}
            index={index}
            key={`${name}-${index}`}
            name={name}
            onRemove={isLast ? onRemove : undefined}
            register={register}
          />
        );
      })}

      <div className="EntranceButtonsBuilder__buttons">
        <ButtonNG variant="primary" onClick={onAdd}>
          Add button
        </ButtonNG>
        {count > 0 && (
          <ButtonNG variant="danger" onClick={onClear}>
            Remove all buttons
          </ButtonNG>
        )}
      </div>
    </div>
  );
};
