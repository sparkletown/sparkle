import React, { useCallback } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

import { WorldEntranceFormInput } from "types/world";

import { ButtonNG } from "components/atoms/ButtonNG";
import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminInput } from "components/molecules/AdminInput";

import "./EntranceButtonsInputFieldSet.scss";

export interface EntranceButtonsInputFieldSetProps {
  errors?: FieldErrors<FieldValues>;
  index: number;
  name: string;
  onRemove: UseFieldArrayRemove;
  register: UseFormRegister<WorldEntranceFormInput>;
}

export const EntranceButtonsInputFieldSet: React.FC<EntranceButtonsInputFieldSetProps> = ({
  errors,
  index,
  name,
  onRemove,
  register,
}) => {
  const fieldText = `text`;
  const fieldLink = `href`;
  const fieldProceed = `isProceed`;
  const fieldset = `${name}.${index}`;
  const inputText = `${fieldset}.${fieldText}`;
  const inputLink = `${fieldset}.${fieldLink}`;
  const inputProceed = `${fieldset}.${fieldProceed}`;

  const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);

  return (
    <fieldset className="EntranceButtonsInputFieldSet" name={fieldset}>
      <AdminInput
        label="Text"
        register={register}
        name={inputText}
        errors={errors}
      />
      <AdminInput
        label="Link"
        register={register}
        name={inputLink}
        errors={errors}
      />
      <AdminCheckbox
        variant="toggler"
        register={register}
        name={inputProceed}
        label="To space"
      />
      <ButtonNG variant="secondary" onClick={handleRemove}>
        Remove button
      </ButtonNG>
    </fieldset>
  );
};
