import React from "react";
import {
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

import { EntranceStepButtonConfig } from "types/EntranceStep";
import { WorldEntranceFormInput } from "types/world";

import { AdminSidebarSectionSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionSubTitle";

import { EntranceButtonsInputFieldSet } from "components/molecules/EntranceButtonsInputFieldSet";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./EntranceButtonsBuilder.scss";

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
      {title && (
        <AdminSidebarSectionSubTitle>{title}</AdminSidebarSectionSubTitle>
      )}

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
