import React, { useMemo } from "react";
import classNames from "classnames";

import { FormFieldProps } from "types/forms";
import { ContainerClassName } from "types/utility";
import { Question } from "types/venues";

import { ProfileModalInput } from "components/organisms/NewProfileModal/components/ProfileModalInput";
import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/components/ProfileModalSectionHeader";

import "./ProfileModalQuestions.scss";

export interface ProfileModalQuestionsProps extends ContainerClassName {
  editMode?: boolean;
  register?: FormFieldProps["register"];
  questions: Question[];
  answers: string[];
}

export const ProfileModalQuestions: React.FC<ProfileModalQuestionsProps> = ({
  editMode,
  register,
  questions,
  answers,
  containerClassName,
}) => {
  const renderedProfileQuestionAnswers = useMemo(
    () =>
      questions?.map((question, i) => (
        <div
          className="ProfileModalQuestions__question-container"
          key={question.text}
        >
          <div className="ProfileModalQuestions__question">{question.text}</div>
          {editMode && register ? (
            <ProfileModalInput
              name={`${question.name}`}
              containerClassName="ProfileModalQuestions__answer-input"
              defaultValue={answers[i]}
              ref={register()}
            />
          ) : (
            <div className="ProfileModalQuestions__answer">{answers[i]}</div>
          )}
        </div>
      )),
    [answers, editMode, questions, register]
  );
  return (
    <div className={classNames("ProfileModalQuestions", containerClassName)}>
      {questions.length > 0 && <ProfileModalSectionHeader text="Questions" />}
      {renderedProfileQuestionAnswers}
    </div>
  );
};
