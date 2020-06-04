import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateUserProfile } from "./helpers";
import "./Account.scss";

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
  const { register, handleSubmit, errors, formState } = useForm<
    QuestionsFormData
  >({
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
        <p>This will helpyour fellow party-goers break the ice</p>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <textarea
              className="input-block input-centered"
              name="islandCompanion"
              placeholder="Who's your dream desert island companion?"
              ref={register({
                required: true,
              })}
            />
            {errors.islandCompanion &&
              errors.islandCompanion.type === "required" && (
                <span className="input-error">Required</span>
              )}
          </div>
          <div className="input-group">
            <textarea
              className="input-block input-centered"
              name="gratefulFor"
              placeholder="What do you feel greateful for?"
              ref={register({
                required: true,
              })}
            />
            {errors.gratefulFor && errors.gratefulFor.type === "required" && (
              <span className="input-error">Required</span>
            )}
          </div>
          <div className="input-group">
            <textarea
              className="input-block input-centered"
              name="likeAboutParties"
              placeholder="What do you like about parties?"
              ref={register({
                required: true,
              })}
            />
            {errors.likeAboutParties &&
              errors.likeAboutParties.type === "required" && (
                <span className="input-error">Required</span>
              )}
          </div>
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
