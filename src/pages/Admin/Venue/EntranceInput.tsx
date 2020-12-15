import { useDynamicInput } from "hooks/useDynamicInput";
import React from "react";
import { Button, Form } from "react-bootstrap";

interface EntranceButtonInputProps {
  fieldName: string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
}
const EntranceButtonInput: React.FC<EntranceButtonInputProps> = ({
  fieldName,
  register,
}) => {
  const { indexes, add, remove, clear } = useDynamicInput();

  const renderButtonInput = (index: number) => {
    const baseName = `${fieldName}[${index}]`;
    const buttonText = `${baseName}text`;
    const buttonHref = `${baseName}href`;

    return (
      <div className="dynamic-input-wrapper" key={`${fieldName}_${index}`}>
        <fieldset name={baseName}>
          <Form.Label>Text</Form.Label>
          <Form.Control ref={register} name={buttonText} custom />

          <Form.Label>Link</Form.Label>
          <Form.Control ref={register} name={buttonHref} custom />
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

interface EntranceInputProps {
  fieldName: string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
}

const EntranceInput: React.FC<EntranceInputProps> = ({
  fieldName,
  register,
}) => {
  const { indexes, add, remove, clear } = useDynamicInput();

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
        </fieldset>

        <Button onClick={remove(index)} variant="secondary">
          Remove entrance step
        </Button>
      </div>
    );
  };

  return (
    <div className="input-container" style={{ marginBottom: "1.5rem" }}>
      <h4 className="italic input-header">Venue entrance</h4>
      {indexes.map((i) => renderEntranceInput(i))}

      <div className="dynamic-input__button-wrapper">
        <Button onClick={add}>Add entrance step</Button>
        {indexes.length > 0 && (
          <Button onClick={clear} variant="secondary">
            Remvoe all entrance steps
          </Button>
        )}
      </div>
    </div>
  );
};

export default EntranceInput;
