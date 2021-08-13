import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { DEFAULT_PROFILE_IMAGE, DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";

import { QuestionType } from "types/Question";

import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { updateUserProfile } from "pages/Account/helpers";
import { ProfileFormData } from "pages/Account/Profile";
import { QuestionsFormData } from "pages/Account/Questions";

import { ProfilePictureInput } from "components/molecules/ProfilePictureInput";

import { Button } from "components/atoms/Button";
import { InputField } from "components/atoms/InputField";

import { UserProfileMode } from "../ProfilePopoverContent";

import "./EditProfileForm.scss";

const validationSchema = Yup.object().shape<Pick<ProfileFormData, "partyName">>(
  {
    partyName: Yup.string().required("Display name is required").max(
      DISPLAY_NAME_MAX_CHAR_COUNT,
      `Display name must be ${DISPLAY_NAME_MAX_CHAR_COUNT} characters or
  less`
    ),
  }
);

export interface EditProfileFormProps {
  setUserProfileMode: (value: UserProfileMode) => void;
}

export const EditProfileForm: React.FunctionComponent<EditProfileFormProps> = ({
  setUserProfileMode,
}) => {
  const venueId = useVenueId();
  const { user, profile } = useUser();
  const { sovereignVenue } = useSovereignVenue({ venueId });

  const profileQuestions = sovereignVenue?.profile_questions;

  const onSubmit = async (data: ProfileFormData & QuestionsFormData) => {
    if (!user) return;

    await updateUserProfile(user.uid, data);
    setUserProfileMode(UserProfileMode.DEFAULT);
  };
  const defaultValues = {
    partyName: profile?.partyName,
    pictureUrl: profile?.pictureUrl || DEFAULT_PROFILE_IMAGE,
  };

  profileQuestions &&
    profileQuestions.map(
      (question: QuestionType) =>
        // @ts-ignore wtf is this
        (defaultValues[question.name] = profile?.[question.name] || "")
    );

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setValue,
    triggerValidation,
    watch,
  } = useForm<ProfileFormData & QuestionsFormData>({
    validationSchema,
    mode: "onChange",
    defaultValues,
  });

  // this useEffect forces the form validation when the component is mounted
  useEffect(() => {
    triggerValidation();
  }, [triggerValidation]);

  const pictureUrl = watch("pictureUrl");

  return (
    <div className="EditProfileForm">
      <h1 className="EditProfileForm__title">Edit profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <InputField
          containerClassName="EditProfileForm__input-container-name"
          inputClassName="EditProfileForm__input-name"
          name="partyName"
          placeholder="Your display name"
          error={errors.partyName}
          ref={register()}
        />

        {user && venueId && (
          <ProfilePictureInput
            venueId={venueId}
            setValue={setValue}
            user={user}
            errors={errors}
            pictureUrl={pictureUrl}
            register={register}
          />
        )}
        {profileQuestions &&
          profileQuestions.map((question: QuestionType) => (
            <div key={question.name}>
              <div className="EditProfileForm__question">{question.text}</div>
              <div className="input-group">
                <textarea
                  className="input-block input-centered"
                  name={question.name}
                  ref={register()}
                />
              </div>
            </div>
          ))}

        <Button
          type="submit"
          disabled={!formState.isValid}
          customClass="EditProfileForm__submit-button"
        >
          Save Changes
        </Button>
      </form>
      <div className="EditProfileForm__cancel-container">
        <button
          className="button--a"
          onClick={() => setUserProfileMode(UserProfileMode.DEFAULT)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
