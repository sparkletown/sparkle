import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateUserProfile } from "./helpers";
import { profileQuestions } from "./constants";
import "./Account.scss";
import { QuestionType } from "types/Question";

export interface QuestionsFormData {
  islandCompanion: string;
  gratefulFor: string;
  likeAboutParties: string;
}

const Questions = () => {
  const history = useHistory();
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));
  const { register, handleSubmit, formState } = useForm<QuestionsFormData>({
    mode: "onChange",
  });
  const onSubmit = async (data: QuestionsFormData) => {
    await updateUserProfile(user.uid, data);
    history.push("/account/code-of-conduct");
  };

  return (
    <div className="page-container">
      <div className="coreality-logo-sparkles"></div>
      <div className="login-container">
        <h2>Now complete your profile by answering 3 short questions</h2>
        <p>This will help your fellow party-goers break the ice</p>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {profileQuestions.map((question: QuestionType) => (
            <div className="input-group">
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
