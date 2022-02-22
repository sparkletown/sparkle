import React, { useMemo } from "react";
import { UseFormRegister } from "react-hook-form";
import classNames from "classnames";

import { UserProfileModalFormData } from "types/profileModal";
import { Question } from "types/Question";
import { ContainerClassName } from "types/utility";

import { ProfileModalInput } from "components/organisms/NewProfileModal/components/ProfileModalInput";
import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/components/ProfileModalSectionHeader";

import "./ProfileModalQuestions.scss";

export interface ProfileModalQuestionsProps extends ContainerClassName {
  editMode?: boolean;
  register?: UseFormRegister<UserProfileModalFormData>;
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
              containerClassName="ProfileModalQuestions__answer-input"
              defaultValue={answers[i]}
              register={register}
              name={question.name}
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
