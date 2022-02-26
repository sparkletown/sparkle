import React, { useCallback } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "components/admin/Button";
import { Checkbox } from "components/admin/Checkbox";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";

import { WorldEntranceFormInput } from "types/world";

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
      <InputGroup title="Text">
        <Input register={register} name={inputText} errors={errors} />
      </InputGroup>

      <InputGroup title="Link">
        <Input register={register} name={inputLink} errors={errors} />
      </InputGroup>

      <Checkbox
        variant="toggler"
        register={register}
        name={inputProceed}
        label="To space"
      />
      <Button variant="secondary" onClick={handleRemove}>
        Remove button
      </Button>
    </fieldset>
  );
};
