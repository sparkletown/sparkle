import React, { useCallback } from "react";
import { FieldErrors, OnSubmit, useFieldArray, useForm } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";
import { pick, uniq } from "lodash";

import {
  profileModalPasswordsFields,
  UserProfileModalFormData,
  UserProfileModalFormDataPasswords,
} from "types/profileModal";
import { ProfileLink, User } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { propName, userProfileModalFormProp as formProp } from "utils/propName";

import { useCheckOldPassword } from "hooks/useCheckOldPassword";
import { useProfileModalFormDefaultValues } from "hooks/useProfileModalFormDefaultValues";
import { useProfileQuestions } from "hooks/useProfileQuestions";

import { updateUserProfile } from "pages/Account/helpers";

import { EditProfileModalButtons } from "components/organisms/NewProfileModal/components/buttons/EditProfileModalButtons";
import { ProfileModalEditBasicInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalEditBasicInfo";
import { ProfileModalEditLinks } from "components/organisms/NewProfileModal/components/links/ProfileModalEditLinks";
import { ProfileModalChangePassword } from "components/organisms/NewProfileModal/components/ProfileModalChangePassword";
import { ProfileModalQuestions } from "components/organisms/NewProfileModal/components/ProfileModalQuestions";

import "./EditingProfileModalContent.scss";

export interface CurrentUserProfileModalContentProps {
  user: WithId<User>;
  venue: WithId<AnyVenue>;
  onCancelEditing: () => void;
  isSubmitting: boolean;
  handleSubmitWrapper: (
    handler: OnSubmit<UserProfileModalFormData>
  ) => OnSubmit<UserProfileModalFormData>;
}

export const EditingProfileModalContent: React.FC<CurrentUserProfileModalContentProps> = ({
  user,
  venue,
  onCancelEditing,
  isSubmitting,
  handleSubmitWrapper,
}) => {
  const { questions, answers } = useProfileQuestions(user, venue.id);
  const firebaseUser = useFirebase().auth()?.currentUser;

  const defaultValues = useProfileModalFormDefaultValues(
    user,
    questions,
    answers
  );

  const checkOldPassword = useCheckOldPassword();

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
    formState,
  } = useForm<UserProfileModalFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    validateCriteriaMode: "all",
    defaultValues,
  });

  const {
    fields: links,
    append: addLink,
    remove: removeLink,
  } = useFieldArray<ProfileLink>({
    control,
    name: formProp("profileLinks"),
  });

  const cancelEditing = useCallback(() => {
    onCancelEditing();
    reset();
  }, [reset, onCancelEditing]);

  const addLinkHandler = useCallback(() => {
    addLink({ url: "", title: "" });
  }, [addLink]);

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

  const onSubmit = useCallback(
    async (data: UserProfileModalFormData) => {
      if (!firebaseUser) return;

      const passwordsNotEmpty = Object.values(
        pick(data, profileModalPasswordsFields)
      ).some((x) => x);
      if (passwordsNotEmpty) {
        if (!(await checkOldPassword(data.oldPassword))) {
          setError(formProp("oldPassword"), "validate", "Incorrect password");
          return;
        } else {
          clearError(formProp("oldPassword"));
          await firebaseUser.updatePassword(data.confirmNewPassword);
        }
      }

      const changedFields = uniq(
        Array.from(formState.dirtyFields)
          .filter(
            (k) =>
              !profileModalPasswordsFields.includes(
                k as keyof UserProfileModalFormDataPasswords
              )
          )
          // formState.dirtyFields expressed nested fields like this: "profileLinks[0].url", "profileLinks[0].title"
          // so we need to transform them
          .map((k) =>
            k.startsWith(formProp("profileLinks")) ? "profileLinks" : k
          )
      ) as (keyof UserProfileModalFormData)[];

      if (changedFields.length > 0) {
        await updateUserProfile(firebaseUser.uid, pick(data, changedFields));
      }

      onCancelEditing();
    },
    [
      firebaseUser,
      formState.dirtyFields,
      onCancelEditing,
      checkOldPassword,
      setError,
      clearError,
    ]
  );

  return (
    <form onSubmit={handleSubmit(handleSubmitWrapper(onSubmit))}>
      <ProfileModalEditBasicInfo
        venueId={venue.id}
        user={user}
        containerClassName="EditingProfileModalContent__section"
        register={register}
        watch={watch}
        setValue={setValue}
        partyNameError={errors?.partyName}
      />
      <ProfileModalQuestions
        editMode
        containerClassName="EditingProfileModalContent__section"
        questions={questions}
        answers={answers}
        register={register}
      />
      <ProfileModalEditLinks
        containerClassName="EditingProfileModalContent__section"
        register={register}
        initialLinks={defaultValues.profileLinks ?? []}
        links={links}
        setLinkTitle={setLinkTitle}
        errors={errors?.profileLinks}
        onDeleteLink={removeLink}
        onAddLink={addLinkHandler}
      />
      <ProfileModalChangePassword
        containerClassName="EditingProfileModalContent__section"
        register={register}
        getValues={getValues}
        errors={pick<
          FieldErrors<UserProfileModalFormData>,
          "oldPassword" | "newPassword" | "confirmNewPassword"
        >(errors, ["oldPassword", "newPassword", "confirmNewPassword"])}
      />
      <EditProfileModalButtons
        onCancelClick={cancelEditing}
        isSubmitting={isSubmitting}
        containerClassName="EditingProfileModalContent__edit-buttons"
      />
    </form>
  );
};
