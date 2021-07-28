import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsync, useAsyncFn, useSearchParam } from "react-use";
import { mapValues, get } from "lodash";
import firebase from "firebase/app";
import "firebase/storage";

import { IS_BURN } from "secrets";

import { DEFAULT_VENUE, DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";

import { isTruthy } from "utils/types";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";
import { ProfilePictureInput } from "components/molecules/ProfilePictureInput";

import { updateUserProfile } from "./helpers";

// @debt refactor the Profile related styles from Account.scss into Profile.scss
import "./Account.scss";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
  companyTitle?: string;
  companyDepartment?: string;
}

export const Profile: React.FC = () => {
  const history = useHistory();
  const { user, userWithId } = useUser();

  const venueId = useVenueId() ?? DEFAULT_VENUE;

  const returnUrl: string | undefined =
    useSearchParam("returnUrl") ?? undefined;

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
    defaultValues: {
      partyName: userWithId?.partyName,
      pictureUrl: userWithId?.pictureUrl,
      companyTitle: userWithId?.companyTitle,
      companyDepartment: userWithId?.companyDepartment,
    },
  });

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

  const [{ loading: isUpdating, error: httpError }, onSubmit] = useAsyncFn(
    async (data: ProfileFormData) => {
      if (!user) return;

      await updateUserProfile(user.uid, data);

      const accountQuestionsUrlParams = new URLSearchParams();
      accountQuestionsUrlParams.set("venueId", venueId);
      returnUrl && accountQuestionsUrlParams.set("returnUrl", returnUrl);

      // @debt Should we throw an error here rather than defaulting to empty string?
      const nextUrl = venueId
        ? `/account/questions?${accountQuestionsUrlParams.toString()}`
        : returnUrl ?? "";

      history.push(IS_BURN ? `/enter/step3` : nextUrl);
    },
    [history, returnUrl, user, venueId]
  );

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
        Hey, {firstName ?? "you"}. We’re so glad you’re here!
      </h2>

      <div className="login-welcome-subtitle">
        We&apos;ve pre-populated your profile with details from Okta - please{" "}
        <br /> review and click Next if it all looks good.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="input-group profile-form">
          {/* @debt refactor this to use InputField */}
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

          {/* @debt refactor this to use InputField */}
          <input
            name="realName"
            className="input-block input-centered"
            placeholder="Your real name"
            defaultValue={realName}
            ref={register()}
            autoComplete="off"
          />
          <p className="input-info">This is your real name</p>

          {/* @debt refactor this to use InputField */}
          <input
            name="companyTitle"
            className="input-block input-centered"
            placeholder="Your title"
            defaultValue={companyTitle}
            ref={register()}
            autoComplete="off"
          />
          <p className="input-info">This is your title</p>

          {/* @debt refactor this to use InputField */}
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
              {...{
                venueId,
                setValue,
                githubHandle,
                user,
                errors,
                pictureUrl,
                register,
              }}
            />
          )}
        </div>

        <div className="input-group">
          <button
            type="submit"
            className="btn btn-primary btn-block btn-centered"
            disabled={!formState.isValid || isUpdating}
          >
            Next
          </button>
          {isUpdating && <Loading />}
          {httpError && (
            <span className="input-error">{httpError.message}</span>
          )}
        </div>
      </form>

      <p className="Profile__issues-text">
        Trouble registering? Find help at: <strong>#rko-fy22-help</strong> or
        email events@github.com
      </p>
    </div>
  );
};
