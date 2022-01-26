import React, { ChangeEventHandler, useCallback } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { EntranceStepButtonConfig } from "types/EntranceStep";

import { UseArrayRemove, UseArrayUpdate } from "hooks/useArray";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminInput } from "components/molecules/AdminInput";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./EntranceButtonsInputFieldSet.scss";

export interface EntranceButtonsInputFieldSetProps {
  errors?: FieldErrors<FieldValues>;
  index: number;
  name: string;
  onUpdate: UseArrayUpdate<EntranceStepButtonConfig>;
  onRemove: UseArrayRemove<EntranceStepButtonConfig>;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
}

export const EntranceButtonsInputFieldSet: React.FC<
  EntranceButtonsInputFieldSetProps
> = ({ errors, index, name, onUpdate, onRemove, register }) => {
  const fieldText = `text`;
  const fieldLink = `href`;
  const fieldProceed = `isProceed`;
  const fieldset = `${name}[${index}]`;
  const inputText = `${fieldset}${fieldText}`;
  const inputLink = `${fieldset}${fieldLink}`;
  const inputProceed = `${fieldset}${fieldProceed}`;

  const handleRemove = useCallback(
    () => onRemove({ index }),
    [onRemove, index]
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      const { value, attributes, type, checked } = target;

      // NOTE: there is possibly more complicated way of using handleChange as a curried function instead of relying on data-, but this works OK
      const name = attributes.getNamedItem("data-field")?.value;
      if (!name) {
        return console.error(
          EntranceButtonsInputFieldSet.name,
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
    <fieldset className="EntranceButtonsInputFieldSet" name={fieldset}>
      <AdminInput
        name={inputText}
        label="Text"
        register={register}
        errors={errors}
        data-field={fieldText}
        onChange={handleChange}
      />
      <AdminInput
        name={inputLink}
        label="Link"
        register={register}
        errors={errors}
        data-field={fieldLink}
        onChange={handleChange}
      />
      <AdminCheckbox
        variant="toggler"
        name={inputProceed}
        register={register}
        label="To space"
        data-field={fieldProceed}
        onChange={handleChange}
      />
      <ButtonNG variant="secondary" onClick={handleRemove}>
        Remove button
      </ButtonNG>
    </fieldset>
  );
};
