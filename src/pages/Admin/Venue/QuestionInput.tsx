import React from "react";
import { Button, Form } from "react-bootstrap";

import { Question } from "types/venues";

import { useDynamicInput } from "hooks/useDynamicInput";

interface QuestionInputProps {
  fieldName: string;
  hasLink?: boolean;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  title?: string;
  editing?: Question[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  fieldName,
  hasLink = false,
  register,
  title,
  editing,
  errors,
}) => {
  const { indexes, add, remove, clear } = useDynamicInput(editing?.length);

  const renderFieldset = (index: number) => {
    const baseName = `${fieldName}[${index}]`;
    const inputName = `${baseName}name`;
    const inputText = `${baseName}text`;
    const inputLink = `${baseName}link`;

    return (
      <div className="dynamic-input-wrapper" key={`${fieldName}_${index}`}>
        <fieldset name={baseName}>
          <Form.Label>Title</Form.Label>
          <Form.Control ref={register} name={inputName} custom />
          {errors && errors[index].name && (
            <span className="input-error">{errors[index].name.message}</span>
          )}

          <Form.Label>Text</Form.Label>
          <Form.Control ref={register} name={inputText} as="textarea" custom />
          {errors && errors[index].text && (
            <span className="input-error">{errors[index].text.message}</span>
          )}

          {hasLink && (
            <>
              <Form.Label>Link</Form.Label>
              <Form.Control ref={register} name={inputLink} custom />
              {errors && errors[index].link && (
                <span className="input-error">
                  {errors[index].link.message}
                </span>
              )}
            </>
          )}
        </fieldset>
        <Button onClick={remove(index)} variant="secondary">
          Remove question
        </Button>
      </div>
    );
  };

  return (
    <div className="input-container" style={{ marginBottom: "1.5rem" }}>
      {title && <h4 className="italic input-header">{title}</h4>}

      {indexes.map((i) => renderFieldset(i))}

      <div className="dynamic-input__button-wrapper">
        <Button onClick={add}>Add question</Button>
        {indexes.length > 0 && (
          <Button onClick={clear} variant="secondary">
            Remove all
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionInput;
