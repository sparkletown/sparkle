import { updateProfileLinks } from "api/profile";
import { ProfileModalEditButtons } from "components/organisms/NewProfileModal/components/buttons/ProfileModalEditButtons/ProfileModalEditButtons";
import { ProfileModalChangePassword } from "components/organisms/NewProfileModal/components/ProfileModalChangePassword/ProfileModalChangePassword";
import { useProfileQuestions } from "components/organisms/NewProfileModal/useProfileQuestions";
import { formProp } from "components/organisms/NewProfileModal/utilities";
import { isEqual, pick } from "lodash";
import { updateUserProfile } from "pages/Account/helpers";
import { ProfileFormData } from "pages/Account/Profile";
import { QuestionsFormData } from "pages/Account/Questions";
import React, { useCallback, useMemo } from "react";
import { FieldErrors, OnSubmit, useFieldArray, useForm } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";
import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_PIC } from "settings";
import { ProfileLink, User } from "types/User";
import { AnyVenue } from "types/venues";
import { WithId } from "utils/id";
import { propName } from "utils/types";
import { ProfileModalBasicInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalBasicInfo/ProfileModalBasicInfo";
import { ProfileModalEditLinks } from "components/organisms/NewProfileModal/components/links/ProfileModalEditLinks/ProfileModalEditLinks";
import { ProfileModalQuestions } from "components/organisms/NewProfileModal/components/ProfileModalQuestions/ProfileModalQuestions";
import "./UserProfileModalContent.scss";

interface Props {
  user: WithId<User>;
  venue: WithId<AnyVenue>;
  onCancelEditing: () => void;
}

export interface UserProfileModalFormDataPasswords {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const passwordsFields: (keyof UserProfileModalFormDataPasswords)[] = [
  "oldPassword",
  "newPassword",
  "confirmNewPassword",
];

const arePasswordsNotEmpty = (passwords: UserProfileModalFormDataPasswords) =>
  Object.values(pick(passwords, passwordsFields)).some((x) => x);

export interface UserProfileModalFormData
  extends ProfileFormData,
    UserProfileModalFormDataPasswords,
    QuestionsFormData {
  profileLinks: ProfileLink[];
}

export const UserProfileModalContent: React.FC<Props> = ({
  venue,
  user,
  onCancelEditing: turnOffEditMode,
}) => {
  const firebase = useFirebase();
  const firebaseUser = firebase.auth()?.currentUser;
  const firebaseUserEmail = firebaseUser?.email;

  const { questions, answers } = useProfileQuestions(user, venue.id);

  const defaultValues: Omit<
    UserProfileModalFormData,
    keyof UserProfileModalFormDataPasswords
  > = useMemo(
    () => ({
      profileLinks: user.profileLinks ?? [],
      pictureUrl: user.pictureUrl ?? DEFAULT_PROFILE_PIC,
      partyName: user.partyName ?? DEFAULT_PARTY_NAME,
      ...(questions
        ? Object.assign(
            {},
            ...questions.map((q, i) => ({
              [q.name]: answers?.[i],
            }))
          )
        : {}),
    }),
    [answers, questions, user.partyName, user.pictureUrl, user.profileLinks]
  );

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
    defaultValues,
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
    name: formProp("profileLinks"),
  });

  const links = fields as WithId<ProfileLink>[];

  const addLinkHandler = useCallback(() => {
    addLink({ url: "", title: "" });
  }, [addLink]);

  const checkOldPassword = useCallback(
    async (password: string) => {
      if (!firebaseUserEmail) return;
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(firebaseUserEmail, password);
        return true;
      } catch {
        return false;
      }
    },
    [firebaseUserEmail, firebase]
  );

  const onSubmit: OnSubmit<UserProfileModalFormData> = useCallback(
    async (data) => {
      if (!firebaseUser) return;

      const passwordsNotEmpty = arePasswordsNotEmpty(data);
      if (passwordsNotEmpty) {
        if (!(await checkOldPassword(data.oldPassword))) {
          setError(formProp("oldPassword"), "validate", "Incorrect password");
          return;
        } else {
          clearError(formProp("oldPassword"));
          await firebaseUser.updatePassword(data.confirmNewPassword);
        }
      }

      const fieldsToCheck = [
        formProp("partyName"),
        formProp("pictureUrl"),
        ...questions.map((x) => x.name),
      ];

      const changedFields = fieldsToCheck.filter(
        (field) =>
          !isEqual(
            defaultValues[field as keyof typeof defaultValues],
            data[field as keyof typeof data]
          )
      ) as (keyof typeof data)[];

      if (changedFields.length > 0)
        await updateUserProfile(firebaseUser.uid, pick(data, changedFields));

      if (!isEqual(user.profileLinks, data.profileLinks))
        await updateProfileLinks({
          profileLinks: data.profileLinks,
          userId: user.id,
        });

      turnOffEditMode();
    },
    [
      checkOldPassword,
      clearError,
      defaultValues,
      firebaseUser,
      questions,
      setError,
      turnOffEditMode,
      user.id,
      user.profileLinks,
    ]
  );

  const setLinkTitle = useCallback(
    (index: number, title: string) => {
      setValue(
        `${formProp("profileLinks")}[${index}].${propName<ProfileLink>(
          "title"
        )}`,
        title
      );
    },
    [setValue]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProfileModalBasicInfo
        editMode
        viewingUser={user}
        containerClassName="ProfileModal__section"
        register={register}
        watch={watch}
        setValue={setValue}
        partyNameError={errors?.partyName}
      />
      {
        <ProfileModalQuestions
          editMode
          containerClassName="ProfileModal__section"
          questions={questions}
          answers={answers}
          register={register}
        />
      }
      {user?.profileLinks && (
        <ProfileModalEditLinks
          containerClassName="ProfileModal__section"
          register={register}
          links={links}
          setLinkTitle={setLinkTitle}
          errors={errors?.profileLinks}
          onDeleteLink={removeLink}
          onAddLink={addLinkHandler}
        />
      )}
      <ProfileModalChangePassword
        containerClassName="ProfileModal__section"
        register={register}
        getValues={getValues}
        errors={pick<
          FieldErrors<UserProfileModalFormData>,
          "oldPassword" | "newPassword" | "confirmNewPassword"
        >(errors, ["oldPassword", "newPassword", "confirmNewPassword"])}
      />
      <ProfileModalEditButtons
        onCancelClick={cancelEditing}
        containerClassName="UserProfileModalContent__edit-buttons"
      />
    </form>
  );
};
