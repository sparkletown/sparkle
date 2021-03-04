import React from "react";

import { Question } from "types/venues";

import "./CodeOfConductQuestion.scss";

export interface CodeOfConductQuestionProps {
  question: Question;
  forwardRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
}

export const CodeOfConductQuestion: React.FC<CodeOfConductQuestionProps> = ({
  question,
  forwardRef,
  disabled = false,
}) => (
  <div className="code-of-conduct-question" key={question.name}>
    <label
      htmlFor={question.name}
      className={`checkbox ${question.name && !disabled && "checkbox-checked"}`}
    >
      {question.link && (
        <a href={question.link} target="_blank" rel="noopener noreferrer">
          {question.text}
        </a>
      )}
      {!question.link && question.text}
    </label>
    <input
      type="checkbox"
      name={question.name}
      id={question.name}
      ref={forwardRef}
    />
  </div>
);
