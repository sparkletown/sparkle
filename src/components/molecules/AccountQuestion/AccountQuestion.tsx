import React from "react";

import { Question } from "types/venues";

import "./AccountQuestion.scss";

export interface AccountQuestionProps {
  question: Question;
  forwardRef?: React.RefObject<HTMLTextAreaElement>;
  disabled?: boolean;
}

export const AccountQuestion: React.FC<AccountQuestionProps> = ({
  question,
  forwardRef,
  disabled = false,
}) => (
  <div key={question.name} className="account-question">
    <textarea
      className="account-question__input"
      name={question.name}
      placeholder={question.text}
      disabled={disabled}
      ref={forwardRef}
    />
  </div>
);
