import { useSovereignVenue } from "../../../../hooks/useSovereignVenue";
import { useUser } from "../../../../hooks/useUser";
import { useVenueId } from "../../../../hooks/useVenueId";
import "./ProfileModalQuestions.scss";
import classNames from "classnames";
import React, { useMemo } from "react";
import { ContainerClassName } from "../../../../types/utility";

interface Props extends ContainerClassName {}

export const ProfileModalQuestions: React.FC<Props> = ({
  containerClassName,
}: Props) => {
  const venueId = useVenueId();
  const { sovereignVenue } = useSovereignVenue({ venueId });
  const profileQuestions = sovereignVenue?.profile_questions;
  const { profile } = useUser();

  const renderedProfileQuestionAnswers = useMemo(
    () =>
      profileQuestions?.map((question) => {
        // @ts-ignore User type doesn't accept string indexing.
        // We need to rework the way we store answers to profile questions
        const questionAnswer = profile[question.name];

        if (!questionAnswer) return undefined;

        return (
          <React.Fragment key={question.text}>
            <p className="ProfileModalQuestions__question">{question.text}</p>
            <p className="ProfileModalQuestions__answer">{questionAnswer}</p>
          </React.Fragment>
        );
      }),
    [profileQuestions, profile]
  );
  return (
    <div className={classNames("ProfileModalQuestions", containerClassName)}>
      {profile && renderedProfileQuestionAnswers}
    </div>
  );
};
