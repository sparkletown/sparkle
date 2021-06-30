import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsync } from "react-use";
import { mapValues, get } from "lodash";
import firebase from "firebase/app";
import "firebase/storage";

import { IS_BURN } from "secrets";

import { DISPLAY_NAME_MAX_CHAR_COUNT, DEFAULT_VENUE } from "settings";

import { RouterLocation } from "types/RouterLocation";

import getQueryParameters from "utils/getQueryParameters";
import { isTruthy } from "utils/types";

import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import { updateUserProfile } from "./helpers";

import { LoadingPage } from "components/molecules/LoadingPage";
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

  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG(
    venueId
  );

  const samlProfileMappings = currentVenue?.samlProfileMappings;

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

  const {
    value: samlPrefillData,
    loading: isPrefillDataLoading,
  } = useAsync(async () => {
    if (!samlProfileMappings) return;

    return firebase
      .auth()
      .currentUser?.getIdTokenResult()
      .then((result) =>
        mapValues(samlProfileMappings, (path) => {
          if (!path) return;

          return get(
            result.claims.firebase.sign_in_attributes,
            path,
            undefined
          );
        })
      );
  }, [samlProfileMappings]);

  const {
    githubName: githubHandle,
    firstName,
    lastName,
    companyTitle,
    companyDepartment,
  } = samlPrefillData ?? {};

  const realName = [firstName, lastName].filter(isTruthy).join(" ");

  const pictureUrl = watch("pictureUrl");

  if (!isCurrentVenueLoaded || isPrefillDataLoading) return <LoadingPage />;

  return (
    <div className="Profile">
      <h2 className="login-welcome-title">
        Hey, {githubHandle}. We’re so glad you’re here!
      </h2>
      <div className="login-welcome-subtitle">
        We&apos;ve pre-populated your profile with details from Okta - please{" "}
        <br /> review and click Next if it all looks good.
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="input-group profile-form">
          <input
            name="partyName"
            className="input-block input-centered"
            placeholder="Your display name"
            defaultValue={githubHandle}
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
            defaultValue={companyTitle}
            ref={register()}
            autoComplete="off"
          />
          <p className="input-info">This is your title</p>
          <input
            name="companyDepartment"
            className="input-block input-centered"
            placeholder="Your department"
            defaultValue={companyDepartment}
            ref={register()}
            autoComplete="off"
          />
          <p className="input-info">This is your department</p>
          {user && (
            <ProfilePictureInput
              venueId={venueId}
              setValue={setValue}
              githubHandle={githubHandle}
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
          value="Next"
          disabled={!formState.isValid}
        />
      </form>

      <p className="Profile__issues-text">
        Trouble registering? Find help at:{" "}
        <strong>#summit-21-registration</strong> or email events@github.com
      </p>
    </div>
  );
};

export default Profile;
