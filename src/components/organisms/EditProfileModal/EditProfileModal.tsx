import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./EditProfileModal.scss";
import { ProfileFormData } from "pages/Account/Profile";
import { QuestionsFormData } from "pages/Account/Questions";
import { useSelector } from "react-redux";
import { updateUserProfile } from "pages/Account/helpers";
import { QuestionType } from "types/Question";
import ProfilePictureInput from "components/molecules/ProfilePictureInput";

interface PropsType {
  show: boolean;
  onHide: () => void;
}

const EditProfileModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
}) => {
  const { user, users, profileQuestions } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
    profileQuestions: state.firestore.data.currentVenue.profile_questions,
  }));
  const onSubmit = async (data: ProfileFormData & QuestionsFormData) => {
    await updateUserProfile(user.uid, data);
    onHide();
  };
  const defaultValues: any = {
    partyName: users[user.uid].partyName,
    pictureUrl: users[user.uid].pictureUrl,
  };
  profileQuestions &&
    profileQuestions.map(
      (question: QuestionType) =>
        (defaultValues[question.name] = users[user.uid][question.name])
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
    <Modal show={show} onHide={onHide}>
      <Modal.Body className="edit-profile-modal">
        <h1 className="title">Edit profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group profile-form">
            <input
              name="partyName"
              className="input-block input-centered"
              placeholder="Your jazz bar name"
              ref={register({
                required: true,
                maxLength: 16,
              })}
            />
            {errors.partyName && errors.partyName.type === "required" && (
              <span className="input-error">Jazz bar name is required</span>
            )}
            {errors.partyName && errors.partyName.type === "maxLength" && (
              <span className="input-error">
                Jazz bar name is less than 16 characters
              </span>
            )}
            <ProfilePictureInput
              setValue={setValue}
              user={user}
              errors={errors}
              pictureUrl={pictureUrl}
              register={register}
            />
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
        <div
          className="cancel-button"
          onClick={onHide}
          id="edit-profile-modal-cancel"
        >
          Cancel
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
