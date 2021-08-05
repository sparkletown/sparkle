import { updateProfileLinks } from "api/profile";
import { ProfileModalEditButtons } from "components/organisms/NewProfileModal/components/buttons/ProfileModalEditButtons/ProfileModalEditButtons";
import { ProfileModalChangePassword } from "components/organisms/NewProfileModal/components/ProfileModalChangePassword/ProfileModalChangePassword";
import { formProp } from "components/organisms/NewProfileModal/utility";
import { useBooleanState } from "hooks/useBooleanState";
import { isEqual, pick } from "lodash";
import { updateUserProfile } from "pages/Account/helpers";
import { ProfileFormData } from "pages/Account/Profile";
import React, { useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { FieldErrors, OnSubmit, useFieldArray, useForm } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";
import { ProfileLink, User } from "types/User";
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
  user: WithId<User>;
  venue: WithId<AnyVenue>;
  show: boolean;
  onClose: () => void;
}

export interface UserProfileModalFormData extends ProfileFormData {
  questions: Record<string, string>;
  links: ProfileLink[];
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const UserProfileModal: React.FC<Props> = ({
  venue,
  show,
  user,
  onClose,
}) => {
  const firebase = useFirebase();
  const currentUserEmail = firebase.auth().currentUser?.email;

  const [editMode, turnOnEditMode, turnOffEditMode] = useBooleanState(true);

  const {
    register,
    reset,
    errors,
    setError,
    clearError,
    watch,
    handleSubmit,
    getValues,
    setValue,
    control,
  } = useForm<UserProfileModalFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    validateCriteriaMode: "all",
    defaultValues: {
      links: user.profileLinks,
      pictureUrl: user.pictureUrl,
    },
  });

  const cancelEditing = useCallback(() => {
    turnOffEditMode();
    reset();
  }, [reset, turnOffEditMode]);

  const {
    fields,
    append: addLink,
    remove: removeLink,
  } = useFieldArray<ProfileLink>({
    control,
    name: formProp("links"),
  });

  const links = fields as WithId<ProfileLink>[];

  const addLinkHandler = useCallback(() => {
    addLink({ url: "", title: "" });
  }, [addLink]);

  const checkOldPassword = useCallback(
    async (password: string) => {
      if (!currentUserEmail) return;
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(currentUserEmail, password);
        return true;
      } catch {
        return false;
      }
    },
    [currentUserEmail, firebase]
  );

  const onSubmit: OnSubmit<UserProfileModalFormData> = useCallback(
    async (data) => {
      const firebaseUser = firebase.auth()?.currentUser;
      if (!firebaseUser) return;

      if (
        data.oldPassword !== "" ||
        data.newPassword !== "" ||
        data.confirmNewPassword !== ""
      ) {
        if (!(await checkOldPassword(data.oldPassword))) {
          setError(formProp("oldPassword"), "validate", "Incorrect password");
          return;
        } else {
          clearError(formProp("oldPassword"));
          await firebaseUser.updatePassword(data.confirmNewPassword);
        }
      }

      const changedFields = [
        user.partyName !== data.partyName && formProp("partyName"),
        user.pictureUrl !== data.pictureUrl && formProp("pictureUrl"),
      ].filter((x) => x) as (keyof UserProfileModalFormData)[];
      if (changedFields.length > 0)
        await updateUserProfile(firebaseUser.uid, pick(data, changedFields));

      if (!isEqual(user.profileLinks, data.links))
        await updateProfileLinks({
          profileLinks: data.links,
          userId: user.id,
        });
    },
    [
      checkOldPassword,
      clearError,
      firebase,
      setError,
      user.id,
      user.partyName,
      user.pictureUrl,
      user.profileLinks,
    ]
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

  return (
    <Modal
      style={{ display: "flex" }}
      className="ProfileModal UserProfileModal"
      show={show}
      onHide={onClose}
    >
      <Modal.Body className="ProfileModal__body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ProfileModalBasicInfo
            editMode={editMode}
            onEdit={turnOnEditMode}
            viewingUser={user}
            containerClassName="ProfileModal__section"
            register={register}
            watch={watch}
            setValue={setValue}
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
              register={register}
              links={links}
              setLinkTitle={setLinkTitle}
              errors={errors?.links}
              onDeleteLink={removeLink}
              onAddLink={addLinkHandler}
            />
          ) : (
            <ProfileModalLinks
              viewingUser={user}
              containerClassName="ProfileModal__section"
            />
          )}
          {/*{!editMode && (*/}
          {/*  <div className="ProfileModal__section">*/}
          {/*    <label*/}
          {/*      htmlFor="chk-mirrorVideo"*/}
          {/*      className={`checkbox ${*/}
          {/*        user?.mirrorVideo && "checkbox-checked"*/}
          {/*      }`}*/}
          {/*    >*/}
          {/*      Mirror my video*/}
          {/*    </label>*/}
          {/*    <input*/}
          {/*      type="checkbox"*/}
          {/*      name="mirrorVideo"*/}
          {/*      id="chk-mirrorVideo"*/}
          {/*      defaultChecked={user?.mirrorVideo || false}*/}
          {/*      onClick={() =>{}}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*)}*/}
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
              onCancelClick={cancelEditing}
              saveChangesDisabled={false}
              containerClassName="UserProfileModal__edit-buttons"
            />
          )}
        </form>
      </Modal.Body>
    </Modal>
  );
};
