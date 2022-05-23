import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn, useSearchParam } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/attendee/Button";
import { Input } from "components/attendee/Input";
import { Spacer } from "components/attendee/Spacer";

import {
  ACCOUNT_ROOT_URL,
  DISPLAY_NAME_MAX_CHAR_COUNT,
  RETURN_URL_PARAM_NAME,
} from "settings";

import { profileSchema, ProfileSchemaShape } from "forms/profileSchema";

import { useLiveUser } from "hooks/user/useLiveUser";

import CN from "pages/auth/auth.module.scss";

import { Loading } from "components/molecules/Loading";
import { ProfilePictureInput } from "components/molecules/ProfilePictureInput";

import "firebase/storage";

import { updateUserProfile } from "./helpers";

export const Profile: React.FC = () => {
  const history = useHistory();
  const { userId, userWithId } = useLiveUser();
  const returnUrl = useSearchParam(RETURN_URL_PARAM_NAME);

  const {
    register,
    handleSubmit,
    control,
    formState,
    setValue,
    watch,
  } = useForm<ProfileSchemaShape>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(profileSchema),
    defaultValues: {
      partyName: userWithId?.partyName,
      pictureUrl: userWithId?.pictureUrl,
    },
  });

  const { errors } = useFormState({ control });

  const [{ loading: isUpdating, error: httpError }, onSubmit] = useAsyncFn(
    async (data: ProfileSchemaShape) => {
      if (!userId) return;

      await updateUserProfile(userId, data);

      history.push(returnUrl || ACCOUNT_ROOT_URL);
    },
    [userId, history, returnUrl]
  );

  const pictureUrl = watch("pictureUrl");

  return (
    <div data-bem="Profile" className={CN.login}>
      <div className={CN.contents}>
        <h2 className={CN.center}>Create your profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group profile-form">
            <Spacer>
              {
                // @debt Input label is skewed by applying it to ::after pseudo element, this is a workaround
              }
              <span>Display name</span>
              <Input
                name="partyName"
                variant="login"
                border="border"
                placeholder="Your display name"
                autoComplete="off"
                register={register}
                error={errors.partyName}
                subtext={`This is your display name (max ${DISPLAY_NAME_MAX_CHAR_COUNT} characters)`}
              />
            </Spacer>

            <Spacer>
              {userId && (
                <ProfilePictureInput
                  setValue={setValue}
                  userId={userId}
                  errors={errors}
                  pictureUrl={pictureUrl}
                  register={register}
                />
              )}
            </Spacer>
          </div>

          <Spacer>
            <Button
              type="submit"
              className="create-account__button"
              variant="primary"
              disabled={!formState.isValid || isUpdating}
            >
              Create my profile
            </Button>
            {isUpdating && <Loading />}
            {httpError && (
              <span className="input-error">{httpError.message}</span>
            )}
          </Spacer>
        </form>
      </div>
    </div>
  );
};
