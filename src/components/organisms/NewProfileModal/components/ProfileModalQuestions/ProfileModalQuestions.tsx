import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/components/ProfileModalSectionHeader/ProfileModalSectionHeader";
import { formProp } from "components/organisms/NewProfileModal/utility";
import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useVenueId } from "hooks/useVenueId";
import "components/organisms/NewProfileModal/components/ProfileModalQuestions/ProfileModalQuestions.scss";
import classNames from "classnames";
import React, { useMemo } from "react";
import { FormFieldProps } from "types/forms";
import { ContainerClassName } from "types/utility";
import { WithId } from "utils/id";
import { User } from "types/User";

interface Props extends ContainerClassName {
  editMode?: boolean;
  viewingUser: WithId<User>;
  register?: FormFieldProps["register"];
}

export const ProfileModalQuestions: React.FC<Props> = ({
  viewingUser,
  editMode,
  register,
  containerClassName,
}: Props) => {
  const venueId = useVenueId();
  const { sovereignVenue } = useSovereignVenue({ venueId });
  const profileQuestions = sovereignVenue?.profile_questions;

  const renderedProfileQuestionAnswers = useMemo(
    () =>
      profileQuestions?.map((question) => {
        // @ts-ignore User type doesn't accept string indexing.
        // We need to rework the way we store answers to profile questions
        const questionAnswer = viewingUser[question.name];

        if (!questionAnswer) return undefined;

        return (
          <div
            className="ProfileModalQuestions__question-container"
            key={question.text}
          >
            <p className="ProfileModalQuestions__question">{question.text}</p>
            {editMode && register ? (
              <input
                name={`${formProp("questions")}.${question.text}`}
                className="ProfileModalQuestions__answer-input"
                defaultValue={questionAnswer}
                ref={register()}
              />
            ) : (
              <p className="ProfileModalQuestions__answer">{questionAnswer}</p>
            )}
          </div>
        );
      }),
    [editMode, profileQuestions, register, viewingUser]
  );
  return (
    <div className={classNames("ProfileModalQuestions", containerClassName)}>
      <ProfileModalSectionHeader text="Questions" />
      {viewingUser && renderedProfileQuestionAnswers}
    </div>
  );
};
