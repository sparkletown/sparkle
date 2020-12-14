import React, { useCallback, useState } from "react";
import { Form, Button } from "react-bootstrap";

interface QuestionInputProps {
  fieldName: string;
  hasLink?: boolean;
  register: unknown;
  title: string;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  fieldName,
  hasLink = false,
  register,
  title,
}) => {
  const [counter, setConductQuestionsCounter] = useState(0);
  const [indexes, setConductQuestionsIndexes] = useState<number[]>([]);

  const addQuestion = useCallback(() => {
    setConductQuestionsIndexes((prevIndexes) => [...prevIndexes, counter]);
    setConductQuestionsCounter((prevCounters) => prevCounters + 1);
  }, [counter]);

  const removeQuestion = useCallback(
    (index: number) => () => {
      setConductQuestionsIndexes((prevIndexes) => [
        ...prevIndexes.filter((i) => i !== index),
      ]);
      setConductQuestionsCounter((prevCounters) => prevCounters - 1);
    },
    []
  );

  const clearQuestions = useCallback(() => {
    setConductQuestionsIndexes([]);
    setConductQuestionsCounter(0);
  }, []);

  const renderFieldset = (index: number) => {
    const baseName = `${fieldName}[${index}]`;
    const inputName = `${baseName}name`;
    const inputText = `${baseName}text`;
    const inputLink = `${baseName}link`;

    return (
      <div className="question-wrapper" key={`${fieldName}_${index}`}>
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
        <Button onClick={removeQuestion(index)}>Remove question</Button>
      </div>
    );
  };

  return (
    <div className="input-container" style={{ marginBottom: "1.5rem" }}>
      <h4 className="italic input-header">{title}</h4>

      {indexes.map((i) => renderFieldset(i))}

      <div>
        <Button onClick={addQuestion}>Add question</Button>
        {indexes.length > 0 && (
          <Button onClick={clearQuestions}>Remove all</Button>
        )}
      </div>
    </div>
  );
};

export default QuestionInput;
