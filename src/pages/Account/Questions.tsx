import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { currentVenueSelectorData } from "utils/selectors";
import { updateUserProfile } from "./helpers";
import "./Account.scss";
import { QuestionType } from "types/Question";
import { RouterLocation } from "types/RouterLocation";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { updateTheme } from "pages/VenuePage/helpers";
import { AnyVenue } from "types/venues";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";

export interface QuestionsFormData {
  islandCompanion: string;
  gratefulFor: string;
  likeAboutParties: string;
}

interface PropsType {
  location: RouterLocation;
}

const Questions: React.FunctionComponent<PropsType> = ({ location }) => {
  useConnectCurrentVenue();

  const history = useHistory();
  const { user } = useUser();
  const venue = useSelector(currentVenueSelectorData) as AnyVenue;
  const { register, handleSubmit, formState } = useForm<QuestionsFormData>({
    mode: "onChange",
  });

  const proceed = () => {
    history.push(`/account/code-of-conduct${location.search}`);
  };

  const onSubmit = async (data: QuestionsFormData) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    proceed();
  };

  useEffect(() => {
    if (!venue) return;

    // @debt replace this with useCss?
    updateTheme(venue);
  }, [venue]);

  if (!venue) {
    return <>Loading...</>;
  }

  // Skip this screen if there are no profile questions for the venue
  if (!venue?.profile_questions?.length) {
    proceed();
  }

  const headerMessage =
    "To help other Hubbers find and get to know you, tell us a little about yourself";

  return (
    <div className="page-container questions-container">
      <div className="hero-logo github"></div>
      <div className="login-container">
        <h2 className="header-message">{headerMessage}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {venue.profile_questions &&
            venue.profile_questions.map((question: QuestionType, index) => (
              <div key={question.name} className="input-group question-input">
                {index <= 1 ? (
                  <p> {question.name}* </p>
                ) : (
                  <p> {question.name} </p>
                )}
                <textarea
                  className="input-block input-centered"
                  name={question.name}
                  placeholder={question.text}
                  ref={register()}
                />
              </div>
            ))}
          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Create profile"
            disabled={!formState.isValid}
          />
        </form>
      </div>
    </div>
  );
};

export default Questions;
