import React, { useCallback } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { AdminInput } from "components/molecules/AdminInput";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./QuestionFieldSet.scss";

export interface QuestionFieldSetProps {
  errors?: FieldErrors<FieldValues>;
  hasLink?: boolean;
  index: number;
  name: string;
  onRemove?: (item: { index: number; fieldset: string }) => void;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
}

export const QuestionFieldSet: React.FC<QuestionFieldSetProps> = ({
  errors,
  hasLink,
  index,
  name,
  onRemove,
  register,
}) => {
  const fieldset = `${name}[${index}]`;
  const inputName = `${fieldset}name`;
  const inputText = `${fieldset}text`;
  const inputLink = `${fieldset}link`;

  const handleRemove = useCallback(() => onRemove?.({ index, fieldset }), [
    onRemove,
    index,
    fieldset,
  ]);

  return (
    <fieldset className="QuestionFieldSet" name={fieldset}>
      <AdminInput
        name={inputName}
        label="Title"
        register={register}
        errors={errors}
      />
      <AdminInput
        name={inputText}
        label="Text"
        register={register}
        errors={errors}
      />

      {hasLink && (
        <AdminInput
          name={inputLink}
          label="Link"
          register={register}
          errors={errors}
        />
      )}

      {onRemove && (
        <ButtonNG variant="secondary" onClick={handleRemove}>
          Remove question
        </ButtonNG>
      )}
    </fieldset>
  );
};
