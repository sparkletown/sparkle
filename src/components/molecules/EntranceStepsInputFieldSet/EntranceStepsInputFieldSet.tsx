import React, { useCallback } from "react";
import {
  Control,
  FieldErrors,
  FieldValues,
  useFieldArray,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

import { EntranceStepConfig } from "types/EntranceStep";
import { WorldEntranceFormInput } from "types/world";

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
  onRemove: UseFieldArrayRemove;
  register: UseFormRegister<WorldEntranceFormInput>;
  control: Control<WorldEntranceFormInput, object>;
}

export const EntranceStepsInputFieldSet: React.FC<EntranceStepsInputFieldSetProps> = ({
  errors,
  index,
  name,
  onRemove,
  register,
  control,
}) => {
  const fieldButtons = `buttons`;
  const fieldUrl = `videoUrl`;
  const fieldTemplate = `template`;
  const fieldset = `${name}.${index}`;
  const inputButtons = `${fieldset}.${fieldButtons}`;
  const inputUrl = `${fieldset}.${fieldUrl}`;
  const inputTemplate = `${fieldset}.${fieldTemplate}`;

  const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);

  // NOTE: buttons are part of the step, so each add/remove/update of them is also an update of the step
  const {
    fields: buttons,
    append: appendButton,
    remove: removeButton,
  } = useFieldArray({
    control,
    name: `entrance.${index}.buttons`,
    shouldUnregister: true,
  });

  const clearButtons = useCallback(() => removeButton(), [removeButton]);
  const handleAddButton = useCallback(
    () =>
      appendButton({
        isProceed: false,
        text: "",
        className: "",
        href: "",
      }),
    [appendButton]
  );

  return (
    <fieldset className="EntranceStepsInputFieldSet" name={fieldset}>
      <EntranceButtonsBuilder
        errors={errors}
        items={buttons}
        name={inputButtons}
        onAdd={handleAddButton}
        onRemove={removeButton}
        onClear={clearButtons}
        register={register}
      />
      <AdminInput
        disabled
        label="Template"
        name={inputTemplate}
        register={register}
        errors={errors}
      />
      <AdminInput
        label="Video URL"
        name={inputUrl}
        register={register}
        errors={errors}
      />
      <ButtonNG variant="secondary" onClick={handleRemove}>
        Remove entrance step
      </ButtonNG>
      <FormErrors errors={errors} />
    </fieldset>
  );
};
