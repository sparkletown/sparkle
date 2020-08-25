import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { updateUserProfile } from "./helpers";
import "firebase/storage";
import "./Account.scss";
import ProfilePictureInput from "components/molecules/ProfilePictureInput";
import { RouterLocation } from "types/RouterLocation";
import { useUser } from "hooks/useUser";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

interface PropsType {
  location?: RouterLocation;
}

const Profile: React.FunctionComponent<PropsType> = ({ location }) => {
  const history = useHistory();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    errors,
    formState,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    history.push(`/enter/step3`);
  };

  const pictureUrl = watch("pictureUrl");

  return (
    <div className="page-container">
      <div className="login-container">
        <h2>Well done! Now create your profile</h2>
        <p>This will give you access to the Playa and all the fun venues!</p>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group profile-form">
            <input
              name="partyName"
              className="input-block input-centered"
              placeholder="Your display name"
              ref={register({
                required: true,
                maxLength: 16,
              })}
            />
            <span className="input-info">
              This is your public name (max 16 characters)
            </span>
            {errors.partyName && errors.partyName.type === "required" && (
              <span className="input-error">Display name is required</span>
            )}
            {errors.partyName && errors.partyName.type === "maxLength" && (
              <span className="input-error">
                Display name is less than 16 characters
              </span>
            )}
            {user && (
              <ProfilePictureInput
                setValue={setValue}
                user={user}
                errors={errors}
                pictureUrl={pictureUrl}
                register={register}
              />
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
