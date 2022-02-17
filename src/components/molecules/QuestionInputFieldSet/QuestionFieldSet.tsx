import React, { ChangeEventHandler, useCallback } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import { Question } from "types/Question";
import { WorldEntranceFormInput } from "types/world";

import { UseArrayRemove, UseArrayUpdate } from "hooks/useArray";

import { AdminInput } from "components/molecules/AdminInput";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./QuestionFieldSet.scss";

export interface QuestionFieldSetProps {
  errors?: FieldErrors<FieldValues>;
  hasLink?: boolean;
  index: number;
  name: string;
  onUpdate: UseArrayUpdate<Question>;
  onRemove: UseArrayRemove<Question>;
  register: UseFormRegister<any>;
}

export const QuestionFieldSet: React.FC<QuestionFieldSetProps> = ({
  errors,
  hasLink,
  index,
  name,
  onUpdate,
  onRemove,
  register,
}) => {
  const fieldName = `name`;
  const fieldText = `text`;
  const fieldLink = `link`;
  const fieldset = `${name}[${index}]`;
  const inputName = `${fieldset}${fieldName}`;
  const inputText = `${fieldset}${fieldText}`;
  const inputLink = `${fieldset}${fieldLink}`;

  const handleRemove = useCallback(() => onRemove({ index }), [
    onRemove,
    index,
  ]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      const { value, attributes, type, checked } = target;

      // NOTE: there is possibly more complicated way of using handleChange as a curried function instead of relying on data-, but this works OK
      const name = attributes.getNamedItem("data-field")?.value;
      if (!name) {
        return console.error(
          QuestionFieldSet.name,
          `data-field is missing on`,
          target
        );
      }

      onUpdate({
        index,
        callback: ({ item }) => ({
          ...item,
          [name]: type === "checkbox" ? checked : value,
        }),
      });
    },
    [onUpdate, index]
  );

  return (
    <fieldset className="QuestionFieldSet" name={fieldset}>
      <AdminInput
        label="Title"
        name={inputName}
        register={register}
        errors={errors}
        data-field={fieldName}
        onChange={handleChange}
      />
      <AdminInput
        label="Text"
        name={inputText}
        register={register}
        errors={errors}
        data-field={fieldText}
        onChange={handleChange}
      />

      {hasLink && (
        <AdminInput
          label="Link"
          name={inputLink}
          register={register}
          errors={errors}
          data-field={fieldLink}
          onChange={handleChange}
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
