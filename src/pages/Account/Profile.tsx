import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import "firebase/storage";
import { useSearchParam } from "react-use";

import { IS_BURN } from "secrets";

import { DEFAULT_VENUE, DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";

import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import { ProfilePictureInput } from "components/molecules/ProfilePictureInput";

import { updateUserProfile } from "./helpers";

import "./Account.scss";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

export const Profile: React.FC = () => {
  const history = useHistory();
  const { user } = useUser();

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
  });

  // @debt replace this with useAsyncFn ?
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    await updateUserProfile(user.uid, data);

    const accountQuestionsUrl = new URL("/account/questions");
    accountQuestionsUrl.searchParams.set("venueId", venueId);
    if (returnUrl) {
      accountQuestionsUrl.searchParams.set("returnUrl", returnUrl);
    }

    // @debt Should we throw an error here rather than defaulting to empty string?
    const nextUrl = venueId ? accountQuestionsUrl : returnUrl ?? "";

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
