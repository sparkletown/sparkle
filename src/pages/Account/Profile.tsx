import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import "firebase/storage";

import { IS_BURN } from "secrets";

import { DEFAULT_VENUE } from "settings";

import { RouterLocation } from "types/RouterLocation";

import getQueryParameters from "utils/getQueryParameters";

import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import { updateUserProfile } from "./helpers";

import ProfilePictureInput from "components/molecules/ProfilePictureInput";

import "./Account.scss";

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
          Hey, [name]. We’re so glad you’re here! Upload or take a photo and
          share your Summit snap here.
        </h2>
        <div className="login-welcome-subtitle">
          {`Swing back and edit your profile anytime you like.`}
        </div>
        <button className="profile-picture-button summit-snap">
          Take a summit snap
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group profile-form">
            {user && (
              <ProfilePictureInput
                venueId={venueId}
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
