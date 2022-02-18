import React, { useCallback } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

import { Question } from "types/Question";
import { WorldEntranceFormInput } from "types/world";

import { AdminInput } from "components/molecules/AdminInput";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./QuestionFieldSet.scss";

export interface QuestionFieldSetProps {
  errors?: FieldErrors<FieldValues>;
  hasLink?: boolean;
  index: number;
  name: string;
  onRemove: UseFieldArrayRemove;
  register: UseFormRegister<WorldEntranceFormInput>;
  item: Question;
}

export const QuestionFieldSet: React.FC<QuestionFieldSetProps> = ({
  errors,
  hasLink,
  index,
  name,
  onRemove,
  register,
  item,
}) => {
  const fieldName = `name`;
  const fieldText = `text`;
  const fieldLink = `link`;
  const fieldset = `${name}.${index}`;
  const inputName = `${fieldset}.${fieldName}`;
  const inputText = `${fieldset}.${fieldText}`;
  const inputLink = `${fieldset}.${fieldLink}`;

  const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);

  return (
    <fieldset className="QuestionFieldSet" name={fieldset}>
      <AdminInput
        label="Title"
        name={inputName}
        register={register}
        errors={errors}
      />
      <AdminInput
        label="Text"
        name={inputText}
        register={register}
        errors={errors}
      />

      {hasLink && (
        <AdminInput
          label="Link"
          name={inputLink}
          register={register}
          errors={errors}
        />
      )}

      {
        <ButtonNG variant="secondary" onClick={handleRemove}>
          Remove question
        </ButtonNG>
      }
    </fieldset>
  );
};
