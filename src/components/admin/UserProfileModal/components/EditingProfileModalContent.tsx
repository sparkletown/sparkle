import React, { useCallback, useMemo } from "react";
import { useFieldArray, useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import firebase from "firebase/compat/app";
import { pick, uniq } from "lodash";

import {
  UserProfileModalFormData,
  UserProfileModalFormDataPasswords,
} from "types/profileModal";
import { User } from "types/User";

import { WithId } from "utils/id";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useCheckOldPassword } from "hooks/useCheckOldPassword";
import { useProfileModalFormDefaultValues } from "hooks/useProfileModalFormDefaultValues";
import { useProfileQuestions } from "hooks/useProfileQuestions";
import { useShowHide } from "hooks/useShowHide";

import { updateUserProfile } from "pages/Account/helpers";

import { ModalTitle } from "components/molecules/Modal/ModalTitle";

import { EditProfileModalButtons } from "./buttons/EditProfileModalButtons";
import { ProfileModalEditBasicInfo } from "./header/ProfileModalEditBasicInfo";
import { ProfileModalEditLinks } from "./links/ProfileModalEditLinks";
import { ProfileModalChangePassword } from "./ProfileModalChangePassword";
import { ProfileModalQuestions } from "./ProfileModalQuestions";

const PASSWORD_FIELDS: (keyof UserProfileModalFormDataPasswords)[] = [
  "oldPassword",
  "newPassword",
  "confirmNewPassword",
];
Object.freeze(PASSWORD_FIELDS);

export interface CurrentUserProfileModalContentProps {
  user: WithId<User>;
  onCancelEditing: () => void;
}

export const EditingProfileModalContent: React.FC<CurrentUserProfileModalContentProps> = ({
  user,
  onCancelEditing,
}) => {
  const { worldId } = useWorldAndSpaceByParams();
  const { questions, answers } = useProfileQuestions(user, worldId);
  const firebaseUser = firebase.auth()?.currentUser;

  const defaultValues = useProfileModalFormDefaultValues(
    user,
    questions,
    answers
  );

  const checkOldPassword = useCheckOldPassword();

  const {
    isShown: isChangePasswordShown,
    show: showChangePassword,
  } = useShowHide();

  const {
    register,
    reset,
    setError,
    clearErrors,
    watch,
    handleSubmit,
    getValues,
    setValue,
    control,
  } = useForm<UserProfileModalFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });

  const { errors, dirtyFields } = useFormState<UserProfileModalFormData>({
    control,
  });

  const { fields: links, append: addLink, remove: removeLink } = useFieldArray({
    control,
    name: "profileLinks",
    shouldUnregister: true,
  });

  const onDeleteLink = useCallback(
    (i: number) => {
      removeLink(i);
    },
    [removeLink]
  );

  const cancelEditing = useCallback(() => {
    onCancelEditing();
    reset();
  }, [reset, onCancelEditing]);

  const addLinkHandler = useCallback(() => {
    addLink({ url: "", title: "" });
  }, [addLink]);

  const [{ loading: isSubmitting }, onSubmit] = useAsyncFn(
    async (data: Omit<UserProfileModalFormData, "profileLinks">) => {
      if (!firebaseUser) return;
      const dataWithProfileLinks = {
        profileLinks: [],
        ...data,
      };

      const passwordsNotEmpty = Object.values(pick(data, PASSWORD_FIELDS)).some(
        (x) => x
      );
      if (passwordsNotEmpty) {
        if (!(await checkOldPassword(data.oldPassword))) {
          setError("oldPassword", {
            type: "validate",
            message: "Incorrect password",
          });
          return;
        } else {
          clearErrors("oldPassword");
          await firebaseUser.updatePassword(data.confirmNewPassword);
        }
      }

      const changedFields = uniq(
        Array.from(Object.keys(dirtyFields))
          .filter(
            (k) =>
              !PASSWORD_FIELDS.includes(
                k as keyof UserProfileModalFormDataPasswords
              )
          )
          // dirtyFields expressed nested fields like this: "profileLinks[0].url", "profileLinks[0].title"
          // so we need to transform them
          .map((k) => (k.startsWith("pofileLinks") ? "profileLinks" : k))
      ) as (keyof UserProfileModalFormData)[];

      if (changedFields.length > 0) {
        await updateUserProfile(
          firebaseUser.uid,
          pick(dataWithProfileLinks, changedFields)
        );
      }

      onCancelEditing();
    },
    [
      firebaseUser,
      dirtyFields,
      onCancelEditing,
      checkOldPassword,
      setError,
      clearErrors,
    ]
  );

  const passwordErrors = useMemo(
    () => pick(errors, ["oldPassword", "newPassword", "confirmNewPassword"]),
    [errors]
  );

  return (
    <div data-bem="EditingProfileModalContent">
      <ModalTitle>Edit profile</ModalTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <ProfileModalEditBasicInfo
          user={user}
          register={register}
          watch={watch}
          setValue={setValue}
          partyNameError={errors?.partyName}
        />
        <ProfileModalQuestions
          editMode
          questions={questions}
          answers={answers}
          register={register}
        />
        <ProfileModalEditLinks
          register={register}
          initialLinks={defaultValues.profileLinks ?? []}
          links={links}
          errors={errors?.profileLinks}
          onDeleteLink={onDeleteLink}
          onAddLink={addLinkHandler}
        />
        {isChangePasswordShown && (
          <ProfileModalChangePassword
            register={register}
            getValues={getValues}
            errors={passwordErrors}
          />
        )}
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <EditProfileModalButtons
            isChangePasswordShown={!isChangePasswordShown}
            onChangePasswordClick={showChangePassword}
            onCancelClick={cancelEditing}
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};
