import React, { useCallback } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { AdminInput } from "components/molecules/AdminInput";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Toggler } from "components/atoms/Toggler";

import "./EntranceButtonsInputFieldSet.scss";

export interface EntranceButtonsInputFieldSetProps {
  errors?: FieldErrors<FieldValues>;
  hasLink?: boolean;
  index: number;
  name: string;
  onRemove?: (item: { index: number; fieldset: string }) => void;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
}

export const EntranceButtonsInputFieldSet: React.FC<EntranceButtonsInputFieldSetProps> = ({
  errors,
  hasLink,
  index,
  name,
  onRemove,
  register,
}) => {
  const fieldset = `${name}[${index}]`;
  const inputText = `${fieldset}text`;
  const inputLink = `${fieldset}href`;
  const inputProceed = `${fieldset}isProceed`;

  const handleRemove = useCallback(() => onRemove?.({ index, fieldset }), [
    onRemove,
    index,
    fieldset,
  ]);

  return (
    <fieldset className="EntranceButtonsInputFieldSet" name={fieldset}>
      <AdminInput
        name={inputText}
        label="Text"
        register={register}
        errors={errors}
      />
      <AdminInput
        name={inputLink}
        label="Link"
        register={register}
        errors={errors}
      />
      <Toggler name={inputProceed} forwardedRef={register} label="To space" />
      {onRemove && (
        <ButtonNG variant="secondary" onClick={handleRemove}>
          Remove button
        </ButtonNG>
      )}
    </fieldset>
  );
};
