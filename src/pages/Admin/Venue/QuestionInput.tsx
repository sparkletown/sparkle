import { useDynamicInput } from "hooks/useDynamicInput";
import React from "react";
import { Form, Button } from "react-bootstrap";
import { Question } from "types/Venue";

interface QuestionInputProps {
  fieldName: string;
  hasLink?: boolean;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  title: string;
  editing?: Question[];
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  fieldName,
  hasLink = false,
  register,
  title,
  editing,
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

          <Form.Label>Text</Form.Label>
          <Form.Control ref={register} name={inputText} as="textarea" custom />

          {hasLink && (
            <>
              <Form.Label>Link</Form.Label>
              <Form.Control ref={register} name={inputLink} custom />
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
      <h4 className="italic input-header">{title}</h4>

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
