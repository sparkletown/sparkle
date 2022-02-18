import React, { useCallback } from "react";
import {
  FieldErrors,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import { useAsyncFn } from "react-use";
import firebase from "firebase/compat/app";
import { pick, uniq } from "lodash";

import {
  UserProfileModalFormData,
  UserProfileModalFormDataPasswords,
} from "types/profileModal";
import { User } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useCheckOldPassword } from "hooks/useCheckOldPassword";
import { useProfileModalFormDefaultValues } from "hooks/useProfileModalFormDefaultValues";
import { useProfileQuestions } from "hooks/useProfileQuestions";
import { useShowHide } from "hooks/useShowHide";

import { updateUserProfile } from "pages/Account/helpers";

import { EditProfileModalButtons } from "components/organisms/NewProfileModal/components/buttons/EditProfileModalButtons";
import { ProfileModalEditBasicInfo } from "components/organisms/NewProfileModal/components/header/ProfileModalEditBasicInfo";
import { ProfileModalEditLinks } from "components/organisms/NewProfileModal/components/links/ProfileModalEditLinks";
import { ProfileModalChangePassword } from "components/organisms/NewProfileModal/components/ProfileModalChangePassword";
import { ProfileModalQuestions } from "components/organisms/NewProfileModal/components/ProfileModalQuestions";

import "./EditingProfileModalContent.scss";

const PASSWORD_FIELDS: (keyof UserProfileModalFormDataPasswords)[] = [
  "oldPassword",
  "newPassword",
  "confirmNewPassword",
];
Object.freeze(PASSWORD_FIELDS);

export interface CurrentUserProfileModalContentProps {
  user: WithId<User>;
  space?: WithId<AnyVenue>;
  onCancelEditing: () => void;
}

export const EditingProfileModalContent: React.FC<CurrentUserProfileModalContentProps> = ({
  user,
  space,
  onCancelEditing,
}) => {
  const { questions, answers } = useProfileQuestions(user, space?.worldId);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProfileModalEditBasicInfo
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
        errors={errors?.profileLinks}
        onDeleteLink={onDeleteLink}
        onAddLink={addLinkHandler}
      />
      {isChangePasswordShown && (
        <ProfileModalChangePassword
          containerClassName="EditingProfileModalContent__section"
          register={register}
          getValues={getValues}
          errors={pick<
            FieldErrors<UserProfileModalFormData>,
            "oldPassword" | "newPassword" | "confirmNewPassword"
          >(errors, ["oldPassword", "newPassword", "confirmNewPassword"])}
        />
      )}
      <EditProfileModalButtons
        isChangePasswordShown={!isChangePasswordShown}
        onChangePasswordClick={showChangePassword}
        onCancelClick={cancelEditing}
        isSubmitting={isSubmitting}
        containerClassName="EditingProfileModalContent__edit-buttons"
      />
    </form>
  );
};
