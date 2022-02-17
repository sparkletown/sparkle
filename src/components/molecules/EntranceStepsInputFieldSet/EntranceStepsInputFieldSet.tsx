import React, { ChangeEventHandler, useCallback } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import {
  EntranceStepButtonConfig,
  EntranceStepConfig,
} from "types/EntranceStep";
import { WorldEntranceFormInput } from "types/world";

import {
  useArray,
  UseArrayAdd,
  UseArrayRemove,
  UseArrayUpdate,
} from "hooks/useArray";

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
  onUpdate: UseArrayUpdate<EntranceStepConfig>;
  onRemove: UseArrayRemove<EntranceStepConfig>;
  register: UseFormRegister<any>;
}

export const EntranceStepsInputFieldSet: React.FC<EntranceStepsInputFieldSetProps> = ({
  item,
  errors,
  index,
  name,
  onUpdate,
  onRemove,
  register,
}) => {
  const fieldButtons = `buttons`;
  const fieldUrl = `videoUrl`;
  const fieldTemplate = `template`;
  const fieldset = `${name}[${index}]`;
  const inputButtons = `${fieldset}${fieldButtons}`;
  const inputUrl = `${fieldset}${fieldUrl}`;
  const inputTemplate = `${fieldset}${fieldTemplate}`;

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
          EntranceStepsInputFieldSet.name,
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

  // NOTE: buttons are part of the step, so each add/remove/update of them is also an update of the step
  const {
    items: buttons,
    add: addButton,
    update: updateButton,
    clear: clearButtons,
    remove: removeButton,
  } = useArray<EntranceStepButtonConfig>(item?.buttons);

  const handleAddButton: UseArrayAdd<EntranceStepButtonConfig> = useCallback(
    (...args) => {
      const buttons = addButton(...args);
      onUpdate({ index, callback: ({ item }) => ({ ...item, buttons }) });
      return buttons;
    },
    [addButton, onUpdate, index]
  );

  const handleRemoveButton: UseArrayRemove<EntranceStepButtonConfig> = useCallback(
    (...args) => {
      const buttons = removeButton(...args);
      onUpdate({ index, callback: ({ item }) => ({ ...item, buttons }) });
      return buttons;
    },
    [removeButton, onUpdate, index]
  );

  const handleUpdateButton: UseArrayUpdate<EntranceStepButtonConfig> = useCallback(
    (...args) => {
      const buttons = updateButton(...args);
      onUpdate({ index, callback: ({ item }) => ({ ...item, buttons }) });
      return buttons;
    },
    [updateButton, onUpdate, index]
  );

  return (
    <fieldset className="EntranceStepsInputFieldSet" name={fieldset}>
      <EntranceButtonsBuilder
        errors={errors}
        items={buttons}
        name={inputButtons}
        onAdd={handleAddButton}
        onUpdate={handleUpdateButton}
        onRemove={handleRemoveButton}
        onClear={clearButtons}
        register={register}
      />
      <AdminInput
        disabled
        label="Template"
        name={inputTemplate}
        register={register}
        errors={errors}
        data-field={fieldTemplate}
        onChange={handleChange}
      />
      <AdminInput
        label="Video URL"
        name={inputUrl}
        register={register}
        errors={errors}
        data-field={fieldUrl}
        onChange={handleChange}
      />
      <ButtonNG variant="secondary" onClick={handleRemove}>
        Remove entrance step
      </ButtonNG>
      <FormErrors errors={errors} />
    </fieldset>
  );
};
