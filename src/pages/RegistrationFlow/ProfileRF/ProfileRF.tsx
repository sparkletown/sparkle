import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn, useSearchParam } from "react-use";

import { IS_BURN } from "secrets";

import { DEFAULT_VENUE, DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { updateUserProfile } from "pages/Account/helpers";

import { Loading } from "components/molecules/Loading";
import { ProfilePictureInput } from "components/molecules/ProfilePictureInput";

import { ButtonNG } from "components/atoms/ButtonNG";

import "firebase/storage";

import { DivRF } from "../DivRF";
import { InputWrapRF } from "../InputWrapRF";
import { PaneRF } from "../PaneRF";
import { SpanRF } from "../SpanRF";

import "./ProfileRF.scss";

export interface ProfileFormRfData {
  partyName: string;
  pictureUrl: string;
}

export const ProfileRF: React.FC = () => {
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
  } = useForm<ProfileFormRfData>({
    mode: "onChange",
    defaultValues: {
      partyName: userWithId?.partyName,
      pictureUrl: userWithId?.pictureUrl,
    },
  });

  const [{ loading: isUpdating, error: httpError }, onSubmit] = useAsyncFn(
    async (data: ProfileFormRfData) => {
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
    <PaneRF className="ProfileRF">
      <DivRF variant="title">Create your profile</DivRF>

      <form onSubmit={handleSubmit(onSubmit)} className="mod--flex-col">
        <DivRF className="mod--flex-col">
          <InputWrapRF
            info={`This is your display name (max ${DISPLAY_NAME_MAX_CHAR_COUNT} characters)`}
            required={
              errors?.partyName?.type === "required" &&
              "Display name is required"
            }
            error={
              errors?.partyName?.type === "maxLength" &&
              `Display name must be ${DISPLAY_NAME_MAX_CHAR_COUNT} characters or less )`
            }
          >
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
          </InputWrapRF>

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
        </DivRF>
        <ButtonNG
          variant="primary"
          type="submit"
          disabled={!formState.isValid || isUpdating}
          loading={isUpdating}
        >
          Create my profile
        </ButtonNG>
        <Loading displayWhile={isUpdating} />
        <SpanRF variant="error">{httpError?.message}</SpanRF>
      </form>
    </PaneRF>
  );
};
