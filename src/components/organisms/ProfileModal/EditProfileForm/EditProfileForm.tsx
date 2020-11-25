import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "./EditProfileForm.scss";
import { ProfileFormData } from "pages/Account/Profile";
import { QuestionsFormData } from "pages/Account/Questions";
import { updateUserProfile } from "pages/Account/helpers";
import { QuestionType } from "types/Question";
import ProfilePictureInput from "components/molecules/ProfilePictureInput";
import { useUser } from "hooks/useUser";
import { DEFAULT_PROFILE_IMAGE } from "settings";
import { useSelector } from "hooks/useSelector";
import { currentVenueSelectorData } from "utils/selectors";

interface EditProfileFormValuesType {
  partyName: string;
  pictureUrl: string;
  [questionId: string]: string;
}

interface PropsType {
  setIsEditMode: (value: boolean) => void;
}

const EditProfileForm: React.FunctionComponent<PropsType> = ({
  setIsEditMode,
}) => {
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
              maxLength: 16,
            })}
          />
          {errors.partyName && errors.partyName.type === "required" && (
            <span className="input-error">Display name is required</span>
          )}
          {errors.partyName && errors.partyName.type === "maxLength" && (
            <span className="input-error">
              Display name must be 16 characters or less
            </span>
          )}
          {user && (
            <ProfilePictureInput
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
                    required: true,
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
