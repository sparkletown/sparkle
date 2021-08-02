import { ProfileModalSectionHeader } from "components/organisms/NewProfileModal/ProfileModalSectionHeader/ProfileModalSectionHeader";
import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useVenueId } from "hooks/useVenueId";
import "./ProfileModalQuestions.scss";
import classNames from "classnames";
import React, { useMemo } from "react";
import { ContainerClassName } from "types/utility";
import { WithId } from "utils/id";
import { User } from "types/User";

interface Props extends ContainerClassName {
  editMode?: boolean;
  viewingUser: WithId<User>;
}

export const ProfileModalQuestions: React.FC<Props> = ({
  viewingUser,
  editMode,
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
            {editMode ? (
              <input
                className="ProfileModal__input ProfileModal__input--condensed ProfileModalQuestions__answer-input"
                name={question.text}
                defaultValue={questionAnswer}
              />
            ) : (
              <p className="ProfileModalQuestions__answer">{questionAnswer}</p>
            )}
          </div>
        );
      }),
    [editMode, profileQuestions, viewingUser]
  );
  return (
    <div className={classNames("ProfileModalQuestions", containerClassName)}>
      <ProfileModalSectionHeader text="Questions" />
      {viewingUser && renderedProfileQuestionAnswers}
    </div>
  );
};
