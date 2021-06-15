import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { DEFAULT_PROFILE_IMAGE, DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";

import { QuestionType } from "types/Question";

import { currentVenueSelectorData } from "utils/selectors";

import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { ProfileFormData } from "pages/Account/Profile";
import { QuestionsFormData } from "pages/Account/Questions";
import { updateUserProfile } from "pages/Account/helpers";

import { InputField } from "components/atoms/InputField";
import { Button } from "components/atoms/Button";

import ProfilePictureInput from "components/molecules/ProfilePictureInput";

import "./EditProfileForm.scss";

interface PropsType {
  setIsEditMode: (value: boolean) => void;
}

const EditProfileForm: React.FunctionComponent<PropsType> = ({
  setIsEditMode,
}) => {
  const venueId = useVenueId();
  const { user, profile } = useUser();
  const profileQuestions = useSelector(
    (state) => currentVenueSelectorData(state)?.profile_questions
  );
  const onSubmit = async (data: ProfileFormData & QuestionsFormData) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    setIsEditMode(false);
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
          ref={register({
            required: true,
            maxLength: DISPLAY_NAME_MAX_CHAR_COUNT,
          })}
        />
        {errors.partyName && errors.partyName.type === "required" && (
          <span className="input-error">Display name is required</span>
        )}
        {errors.partyName && errors.partyName.type === "maxLength" && (
          <span className="input-error">
            Display name must be {DISPLAY_NAME_MAX_CHAR_COUNT} characters or
            less
          </span>
        )}
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
            <>
              <div className="EditProfileForm__question">{question.text}</div>
              <div className="input-group">
                <textarea
                  className="input-block input-centered"
                  name={question.name}
                  ref={register()}
                />
              </div>
            </>
          ))}
        <Button
          type="submit"
          disabled={!formState.isValid}
          customClass="EditProfileForm__submit-button"
        >
          Save Change
        </Button>
      </form>
      <div className="EditProfileForm__cancel-container">
        <div
          className="EditProfileForm__cancel-button"
          onClick={() => setIsEditMode(false)}
        >
          Cancel
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
