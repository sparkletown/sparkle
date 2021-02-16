import React from "react";

import { Button, Form } from "react-bootstrap";
import { useDynamicInput } from "hooks/useDynamicInput";
import { EntranceStepConfig } from "types/EntranceStep";

interface EntranceButtonInputProps {
  fieldName: string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  editing?: EntranceStepConfig[];
}
const EntranceButtonInput: React.FC<EntranceButtonInputProps> = ({
  fieldName,
  register,
  editing,
}) => {
  const { indexes, add, remove, clear } = useDynamicInput(editing?.length);

  const renderButtonInput = (index: number) => {
    const baseName = `${fieldName}[${index}]`;
    const buttonText = `${baseName}text`;
    const buttonHref = `${baseName}href`;
    const buttonIsProceed = `${baseName}isProceed`;

    return (
      <div className="dynamic-input-wrapper" key={`${fieldName}_${index}`}>
        <fieldset name={baseName}>
          <Form.Label>Text</Form.Label>
          <Form.Control ref={register} name={buttonText} custom />

          <Form.Label>Link</Form.Label>
          <Form.Control ref={register} name={buttonHref} custom />

          <Form.Check
            label="To venue"
            ref={register}
            name={buttonIsProceed}
            custom
            id={buttonIsProceed}
          />
        </fieldset>

        <Button onClick={remove(index)} variant="secondary">
          Remove entrance button
        </Button>
      </div>
    );
  };

  return (
    <div>
      {indexes.map((i) => renderButtonInput(i))}

      <div className="dynamic-input__button-wrapper">
        <Button onClick={add} size="sm">
          Add entrance button
        </Button>
        {indexes.length > 0 && (
          <Button onClick={clear} variant="secondary">
            Remove all entrance buttons
          </Button>
        )}
      </div>
    </div>
  );
};

type EntranceErrorTypes = {
  videoUrl: {
    message: string;
  };
};

interface EntranceInputProps {
  fieldName: string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  showTitle?: boolean;
  editing?: EntranceStepConfig[];
  errors?: Record<number, EntranceErrorTypes>;
}

const EntranceInput: React.FC<EntranceInputProps> = ({
  fieldName,
  register,
  showTitle = true,
  editing,
  errors,
}) => {
  const { indexes, add, remove, clear } = useDynamicInput(editing?.length);

  const renderEntranceInput = (index: number) => {
    const baseName = `${fieldName}[${index}]`;
    const videoUrl = `${baseName}videoUrl`;
    const tamplate = `${baseName}template`;

    return (
      <div
        className="dynamic-input-wrapper"
        key={`${fieldName}_${index}`}
        style={{ padding: "0.5em", border: "1px solid #ccc" }}
      >
        <EntranceButtonInput
          fieldName={`${baseName}buttons`}
          register={register}
        />
        <fieldset name={baseName}>
          <Form.Label>Template</Form.Label>
          <Form.Control
            ref={register}
            name={tamplate}
            value="welcomevideo"
            disabled
            custom
          />
          <Form.Label>Video URL</Form.Label>
          <Form.Control ref={register} name={videoUrl} custom />
          {errors?.[index]?.videoUrl && (
            <div className="input-error">{errors[index].videoUrl.message}</div>
          )}
        </fieldset>

        <Button onClick={remove(index)} variant="secondary">
          Remove entrance step
        </Button>
      </div>
    );
  };

  return (
    <div className="input-container" style={{ marginBottom: "1.5rem" }}>
      {showTitle && <h4 className="italic input-header">Venue entrance</h4>}
      {indexes.map((i) => renderEntranceInput(i))}

      <div className="dynamic-input__button-wrapper">
        <Button onClick={add}>Add entrance step</Button>
        {indexes.length > 0 && (
          <Button onClick={clear} variant="secondary">
            Remove all entrance steps
          </Button>
        )}
      </div>
    </div>
  );
};

export default EntranceInput;
