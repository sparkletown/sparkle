import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import "firebase/storage";

import { IS_BURN } from "secrets";

import { DISPLAY_NAME_MAX_CHAR_COUNT, DEFAULT_VENUE } from "settings";

import { RouterLocation } from "types/RouterLocation";

import getQueryParameters from "utils/getQueryParameters";
import { getLocalStorageItem, LocalStorageItem } from "utils/localStorage";
import { isTruthy } from "utils/types";
import { externalUrlAdditionalProps } from "utils/url";

import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import { updateUserProfile } from "./helpers";

import { ProfilePictureInput } from "components/molecules/ProfilePictureInput";

import "./Account.scss";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
  companyTitle?: string;
  companyDepartment?: string;
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

  const profilePrefilledData = getLocalStorageItem(
    LocalStorageItem.prefillProfileData
  );

  const realName = [
    profilePrefilledData?.firstName,
    profilePrefilledData?.lastName,
  ]
    .filter(isTruthy)
    .join(" ");

  const pictureUrl = watch("pictureUrl");

  return (
    <div className="Profile">
      <div className="login-container">
        <h2 className="login-welcome-title">
          Hey, Mona. We’re so glad you’re here! Upload or take a photo and share
          your Summit snap here.
        </h2>
        <div className="login-welcome-subtitle">
          {`Swing back and edit your profile anytime you like.`}
        </div>
        <a
          className="profile-picture-button Profile__summit-snap"
          href="https://virtual.githubphotobooth.com/virtual/capture/gr99n"
          {...externalUrlAdditionalProps}
        >
          Take a Summit snap
        </a>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group profile-form">
            {/* @debt - this input is hidden because for github's event they fetch the names from an OKTA, and for the demo we set the default name to Mona */}
            <input
              name="partyName"
              className="input-block input-centered"
              placeholder="Your display name"
              defaultValue={profilePrefilledData?.githubName}
              ref={register({
                required: true,
                maxLength: DISPLAY_NAME_MAX_CHAR_COUNT,
              })}
              autoComplete="off"
            />
            <p className="input-info">
              This is your display name (max {DISPLAY_NAME_MAX_CHAR_COUNT}{" "}
              characters)
            </p>
            {errors.partyName && errors.partyName.type === "required" && (
              <span className="input-error">Display name is required</span>
            )}
            {errors.partyName && errors.partyName.type === "maxLength" && (
              <span className="input-error">
                Display name must be {DISPLAY_NAME_MAX_CHAR_COUNT} characters or
                less
              </span>
            )}
            {/* TODO: Proper text, namings */}
            <input
              name="realName"
              className="input-block input-centered"
              placeholder="Your real name"
              defaultValue={realName}
              ref={register()}
              autoComplete="off"
            />
            <p className="input-info">This is your real name</p>
            <input
              name="companyTitle"
              className="input-block input-centered"
              placeholder="Your title"
              defaultValue={profilePrefilledData?.companyTitle}
              ref={register()}
              autoComplete="off"
            />
            <p className="input-info">This is your title</p>
            <input
              name="companyDepartment"
              className="input-block input-centered"
              placeholder="Your department"
              defaultValue={profilePrefilledData?.companyDepartment}
              ref={register()}
              autoComplete="off"
            />
            <p className="input-info">This is your department</p>
            {user && (
              <ProfilePictureInput
                venueId={venueId}
                setValue={setValue}
                githubHandle={profilePrefilledData?.githubName}
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
