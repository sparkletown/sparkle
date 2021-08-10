import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn, useSearchParam } from "react-use";

import { IS_BURN } from "secrets";

import { DEFAULT_VENUE, DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { Loading } from "components/molecules/Loading";
import { ProfilePictureInput } from "components/molecules/ProfilePictureInput";

import "firebase/storage";

import { updateUserProfile } from "./helpers";

// @debt refactor the Profile related styles from Account.scss into Profile.scss
import "./Account.scss";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

export const Profile: React.FC = () => {
  const history = useHistory();
  const { user, userWithId } = useUser();

  const venueId = useVenueId() ?? DEFAULT_VENUE;

  const returnUrl: string | undefined =
    useSearchParam("returnUrl") ?? undefined;

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
    },
  });

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
            {/* @debt refactor this to use InputField */}
            <input
              name="partyName"
              className="input-block input-centered"
              placeholder="Your display name"
              ref={register({
                required: true,
                maxLength: DISPLAY_NAME_MAX_CHAR_COUNT,
              })}
              autoComplete="off"
            />
            <span className="input-info">
              This is your display name (max {DISPLAY_NAME_MAX_CHAR_COUNT}{" "}
              characters)
            </span>
            {errors.partyName && errors.partyName.type === "required" && (
              <span className="input-error">Display name is required</span>
            )}
            {errors.partyName && errors.partyName.type === "maxLength" && (
              <span className="input-error">
                Display name must be {DISPLAY_NAME_MAX_CHAR_COUNT} characters or
                less
              </span>
            )}

            {user && (
              <ProfilePictureInput
                {...{ venueId, setValue, user, errors, pictureUrl, register }}
              />
            )}
          </div>

          <div className="input-group">
            <button
              type="submit"
              className="btn btn-primary btn-block btn-centered"
              disabled={!formState.isValid || isUpdating}
            >
              Create my profile
            </button>
            {isUpdating && <Loading />}
            {httpError && (
              <span className="input-error">{httpError.message}</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
