import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateUserProfile } from "./helpers";
import "./Account.scss";
import { QuestionType } from "types/Question";
import { RouterLocation } from "types/RouterLocation";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { updateTheme } from "pages/VenuePage/helpers";

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
  const { user, venue } = useSelector((state: any) => ({
    user: state.user,
    venue: state.firestore.data.currentVenue,
  }));
  const { register, handleSubmit, formState } = useForm<QuestionsFormData>({
    mode: "onChange",
  });
  const onSubmit = async (data: QuestionsFormData) => {
    await updateUserProfile(user.uid, data);
    history.push(`/account/code-of-conduct${location.search}`);
  };

  if (!venue) {
    return <>Loading...</>;
  }

  venue && updateTheme(venue);

  return (
    <div className="page-container">
      <div className="hero-logo sparkle"></div>
      <div className="login-container">
        <h2>Now complete your profile by answering some short questions</h2>
        <p>This will help your fellow partygoers break the ice</p>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {venue.profile_questions &&
            venue.profile_questions.map((question: QuestionType) => (
              <div key={question.name} className="input-group">
                <textarea
                  className="input-block input-centered"
                  name={question.name}
                  placeholder={question.text}
                  ref={register({
                    required: true,
                  })}
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
