import React, { useCallback } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import {
  EntranceStepButtonConfig,
  EntranceStepConfig,
} from "types/EntranceStep";

import { useArray } from "hooks/useArray";

import { EntranceButtonsBuilder } from "components/organisms/EntranceButtonsBuilder";

import { AdminInput } from "components/molecules/AdminInput";
import { FormErrors } from "components/molecules/FormErrors";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./EntranceStepsInputFieldSet.scss";

export interface EntranceStepsInputFieldSetProps {
  item?: EntranceStepConfig;
  errors?: FieldErrors<FieldValues>;
  index: number;
  name: string;
  onRemove?: (item: { index: number; fieldset: string }) => void;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
}

export const EntranceStepsInputFieldSet: React.FC<EntranceStepsInputFieldSetProps> = ({
  item,
  errors,
  index,
  name,
  onRemove,
  register,
}) => {
  const {
    items: buttons,
    add: addButton,
    clear: clearButtons,
    remove: removeButton,
  } = useArray<EntranceStepButtonConfig>(item?.buttons);

  const fieldset = `${name}[${index}]`;
  const inputButtons = `${fieldset}buttons`;
  const inputUrl = `${fieldset}videoUrl`;
  const inputTemplate = `${fieldset}template`;

  const handleRemove = useCallback(() => onRemove?.({ index, fieldset }), [
    onRemove,
    index,
    fieldset,
  ]);

  return (
    <fieldset className="EntranceStepsInputFieldSet" name={fieldset}>
      <EntranceButtonsBuilder
        errors={errors}
        items={buttons}
        name={inputButtons}
        onAdd={addButton}
        onRemove={removeButton}
        onClear={clearButtons}
        register={register}
      />
      <AdminInput
        name={inputTemplate}
        label="Template"
        register={register}
        errors={errors}
      />
      <AdminInput
        name={inputUrl}
        label="Video URL"
        register={register}
        errors={errors}
      />
      {onRemove && (
        <ButtonNG variant="secondary" onClick={handleRemove}>
          Remove entrance step
        </ButtonNG>
      )}
      <FormErrors errors={errors} />
    </fieldset>
  );
};
