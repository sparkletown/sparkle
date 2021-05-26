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
    <div className="edit-profile-modal">
      <h1 className="title">Edit profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="input-group profile-form">
          <input
            name="partyName"
            className="input-block input-centered"
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
        </div>
        {profileQuestions &&
          profileQuestions.map((question: QuestionType) => (
            <>
              <div className="question">{question.text}</div>
              <div className="input-group">
                <textarea
                  className="input-block input-centered"
                  name={question.name}
                  ref={register({
                    required: false,
                  })}
                />
              </div>
            </>
          ))}
        <input
          className="btn btn-primary btn-block btn-centered"
          type="submit"
          value="Save changes"
          disabled={!formState.isValid}
        />
      </form>
      <div className="cancel-button" onClick={() => setIsEditMode(false)}>
        Cancel
      </div>
    </div>
  );
};

export default EditProfileForm;
