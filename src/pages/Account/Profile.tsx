import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateUserProfile } from "./helpers";
import "./Account.scss";

export interface ProfileFormData {
  partyName: string;
}

const Profile = () => {
  const history = useHistory();
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));
  const { register, handleSubmit, errors, formState } = useForm<
    ProfileFormData
  >({
    mode: "onChange",
  });
  const onSubmit = async (data: ProfileFormData) => {
    await updateUserProfile(user.uid, data);
    history.push("/account/questions");
  };

  return (
    <div className="page-container">
      <div className="coreality-logo-sparkles"></div>
      <div className="login-container">
        <h2>First, create your account</h2>
        <p>This will give you access to all sorts of events in Sparkle Town</p>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <input
              name="partyName"
              className="input-block input-centered"
              placeholder="Your party name"
              ref={register({
                required: true,
                maxLength: 16,
              })}
            />
            <span className="input-info">
              This is your public party name (max 16 characters)
            </span>
            {errors.partyName && errors.partyName.type === "required" && (
              <span className="input-error">Party name is required</span>
            )}
            {errors.partyName && errors.partyName.type === "maxLength" && (
              <span className="input-error">
                Party name is less than 16 characters
              </span>
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

export default Profile;
