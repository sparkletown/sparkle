import { ProfileModalEditButtons } from "components/organisms/NewProfileModal/components/buttons/ProfileModalEditButtons/ProfileModalEditButtons";
import { ProfileModalChangePassword } from "components/organisms/NewProfileModal/components/ProfileModalChangePassword/ProfileModalChangePassword";
import { formProp } from "components/organisms/NewProfileModal/utility";
import { useBooleanState } from "hooks/useBooleanState";
import { useUser } from "hooks/useUser";
import { pick } from "lodash";
import React, { useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { FieldErrors, OnSubmit, useForm } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";
import { ProfileLink } from "types/User";
import { AnyVenue } from "types/venues";
import { WithId } from "utils/id";
import { propName } from "utils/types";
import { ProfileModalBasicInfo } from "./components/header/ProfileModalBasicInfo/ProfileModalBasicInfo";
import { ProfileModalEditLinks } from "./components/links/ProfileModalEditLinks/ProfileModalEditLinks";
import { ProfileModalLinks } from "./components/links/ProfileModalLinks/ProfileModalLinks";
import { ProfileModalBadges } from "./components/ProfileModalBadges/ProfileModalBadges";
import { ProfileModalQuestions } from "./components/ProfileModalQuestions/ProfileModalQuestions";
import "./ProfileModal.scss";
import "./UserProfileModal.scss";

interface Props {
  venue: WithId<AnyVenue>;
  show: boolean;
  onClose: () => void;
}

export interface UserProfileModalFormData {
  questions: Record<string, string>;
  links: ProfileLink[];
  partyName: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const UserProfileModal: React.FC<Props> = ({ venue, show, onClose }) => {
  const { userWithId: user } = useUser();
  const firebase = useFirebase();
  const currentUserEmail = firebase.auth().currentUser?.email;

  const [editMode, turnOnEditMode, turnOffEditMode] = useBooleanState(true);

  const {
    register,
    errors,
    setError,
    clearError,
    handleSubmit,
    watch,
    getValues,
    setValue,
  } = useForm<UserProfileModalFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    validateCriteriaMode: "all",
  });

  const checkPassword = useCallback(
    async (password: string) => {
      if (!currentUserEmail) return;
      try {
        console.log("try login");
        await firebase
          .auth()
          .signInWithEmailAndPassword(currentUserEmail, password);
        return true;
      } catch {
        console.log("try login: fail");
        return false;
      }
    },
    [currentUserEmail, firebase]
  );

  const onSubmit: OnSubmit<UserProfileModalFormData> = useCallback(
    async (data) => {
      if (
        data.oldPassword !== "" ||
        data.newPassword !== "" ||
        data.confirmNewPassword !== ""
      ) {
        if (!(await checkPassword(data.oldPassword))) {
          setError(formProp("oldPassword"), "validate", "Incorrect password");
        } else {
          clearError(formProp("oldPassword"));
        }
      }
      console.log(data);
    },
    [checkPassword, clearError, setError]
  );

  const setLinkTitle = useCallback(
    (index: number, title: string) => {
      setValue(
        `${formProp("links")}[${index}].${propName<ProfileLink>("title")}`,
        title
      );
    },
    [setValue]
  );

  // @ts-ignore
  return (
    <Modal
      style={{ display: "flex" }}
      className="ProfileModal UserProfileModal"
      show={show}
      onHide={onClose}
    >
      <Modal.Body className="ProfileModal__body">
        {user && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ProfileModalBasicInfo
              editMode={editMode}
              onEdit={turnOnEditMode}
              viewingUser={user}
              containerClassName="ProfileModal__section"
              register={register}
              partyNameError={errors?.partyName}
            />
            <ProfileModalQuestions
              viewingUser={user}
              editMode={editMode}
              containerClassName="ProfileModal__section"
              register={register}
            />
            {editMode && user?.profileLinks ? (
              <ProfileModalEditLinks
                containerClassName="ProfileModal__section"
                initialLinks={user.profileLinks}
                register={register}
                watch={watch}
                setLinkTitle={setLinkTitle}
                errors={errors?.links}
              />
            ) : (
              <ProfileModalLinks
                viewingUser={user}
                containerClassName="ProfileModal__section"
              />
            )}
            {!editMode && (
              <ProfileModalBadges
                viewingUser={user}
                venue={venue}
                containerClassName={"ProfileModal__section"}
              />
            )}
            {editMode && (
              <ProfileModalChangePassword
                containerClassName="ProfileModal__section"
                register={register}
                getValues={getValues}
                errors={pick<
                  FieldErrors<UserProfileModalFormData>,
                  "oldPassword" | "newPassword" | "confirmNewPassword"
                >(errors, ["oldPassword", "newPassword", "confirmNewPassword"])}
              />
            )}
            {editMode && (
              <ProfileModalEditButtons
                onSaveClick={() => {}}
                onCancelClick={turnOffEditMode}
                saveChangesDisabled={false}
                containerClassName="UserProfileModal__edit-buttons"
              />
            )}
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
};
