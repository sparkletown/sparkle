import React, { useCallback } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "components/admin/Button";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";

import { WorldEntranceFormInput } from "types/world";

export interface QuestionFieldSetProps {
  errors?: FieldErrors<FieldValues>;
  hasLink?: boolean;
  index: number;
  name: string;
  onRemove: UseFieldArrayRemove;
  register: UseFormRegister<WorldEntranceFormInput>;
}

export const QuestionFieldSet: React.FC<QuestionFieldSetProps> = ({
  errors,
  hasLink,
  index,
  name,
  onRemove,
  register,
}) => {
  const fieldName = `name`;
  const fieldText = `text`;
  const fieldLink = `link`;
  const fieldset = `${name}.${index}`;
  const inputName = `${fieldset}.${fieldName}`;
  const inputText = `${fieldset}.${fieldText}`;
  const inputLink = `${fieldset}.${fieldLink}`;
  const orderNumber = index + 1;

  const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);

  return (
    <fieldset className="QuestionFieldSet" name={fieldset}>
      <InputGroup title={`Title ${orderNumber}`}>
        <Input name={inputName} register={register} errors={errors} />
      </InputGroup>

      <InputGroup title={`Text ${orderNumber}`}>
        <Input name={inputText} register={register} errors={errors} />
      </InputGroup>

      {hasLink && (
        <InputGroup title={`Link ${orderNumber}`}>
          <Input name={inputLink} register={register} errors={errors} />
        </InputGroup>
      )}

      <Button variant="secondary" onClick={handleRemove}>
        Remove question
      </Button>
    </fieldset>
  );
};
