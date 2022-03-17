import React, { useMemo } from "react";
import { UseFormRegister } from "react-hook-form";
import classNames from "classnames";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";

import { STRING_DASH_SPACE } from "settings";

import { UserProfileModalFormData } from "types/profileModal";
import { Question } from "types/Question";
import { ContainerClassName } from "types/utility";

import { ProfileModalSectionHeader } from "./ProfileModalSectionHeader";

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
          <InputGroup title={question.text}>
            {editMode && register ? (
              <Input
                defaultValue={answers[i]}
                register={register}
                name={question.name}
              />
            ) : (
              <div className="ProfileModalQuestions__answer">
                {answers[i] ?? STRING_DASH_SPACE}
              </div>
            )}
          </InputGroup>
        </div>
      )),
    [answers, editMode, questions, register]
  );
  return (
    <div className={classNames("ProfileModalQuestions", containerClassName)}>
      {questions.length > 0 && editMode && (
        <ProfileModalSectionHeader text="Questions" />
      )}
      {renderedProfileQuestionAnswers}
    </div>
  );
};
