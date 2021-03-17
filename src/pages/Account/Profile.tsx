import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { updateUserProfile } from "./helpers";
import "firebase/storage";
import "./Account.scss";
import ProfilePictureInput from "components/molecules/ProfilePictureInput";
import { RouterLocation } from "types/RouterLocation";
import { useUser } from "hooks/useUser";
import { IS_BURN } from "secrets";
import getQueryParameters from "utils/getQueryParameters";
import { DEFAULT_VENUE } from "settings";
import { useVenueId } from "hooks/useVenueId";

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
  const venueName = useVenueId();
  const venueId =
    venueName ??
    getQueryParameters(window.location.search)?.venueId?.toString() ??
    DEFAULT_VENUE;
  const { returnUrl } = getQueryParameters(window.location.search);

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
    const accountQuestionsUrl = `/account/questions?venueId=${venueId}${
      returnUrl ? "&returnUrl=" + returnUrl : ""
    }`;
    const nextUrl = venueId ? accountQuestionsUrl : returnUrl?.toString() ?? "";
    history.push(IS_BURN ? `/enter/step3` : nextUrl);
  };

  const pictureUrl = watch("pictureUrl");

  return (
    <div className="page-container-onboarding">
      <div className="login-container">
        <h2 className="login-welcome-title">
          Well done! Now create your profile
        </h2>
        <div className="login-welcome-subtitle">
          {`Don't fret, you'll be able to edit it at any time later`}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group profile-form">
            <input
              name="partyName"
              className="input-block input-centered"
              placeholder="Your first and last name"
              ref={register({
                required: true,
                maxLength: 16,
              })}
              autoComplete="off"
            />
            <span className="input-info">
              This is your public name (max 16 characters)
            </span>
            {errors.partyName && errors.partyName.type === "required" && (
              <span className="input-error">Display name is required</span>
            )}
            {errors.partyName && errors.partyName.type === "maxLength" && (
              <span className="input-error">
                Display name must be 16 characters or less
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
            value="Create my profile"
            disabled={!formState.isValid}
          />
        </form>
      </div>
    </div>
  );
};

export default Profile;
