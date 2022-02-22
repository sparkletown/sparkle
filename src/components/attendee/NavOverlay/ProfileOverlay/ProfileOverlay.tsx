import { useCallback, useEffect, useState } from "react";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { Button } from "components/attendee/Button/Button";
import firebase from "firebase/compat/app";
import { pick, uniq } from "lodash";

import {
  UserProfileModalFormData,
  UserProfileModalFormDataPasswords,
} from "types/profileModal";
import { ProfileLink, User } from "types/User";

import { WithId } from "utils/id";
import { propName, userProfileModalFormProp as formProp } from "utils/propName";

import { useCheckOldPassword } from "hooks/useCheckOldPassword";
import { useProfileModalFormDefaultValues } from "hooks/useProfileModalFormDefaultValues";

import { updateUserProfile } from "pages/Account/helpers";

import { ProfileModalEditBasicInfo } from "./BasicInfo/ProfileModalEditBasicInfo";
import { ProfileModalEditLinks } from "./Links/ProfileModalEditLinks";
import { ProfileModalChangePassword } from "./Password/ProfileModalChangePassword";
import { AudioSettings } from "./AudioSettings";
import { VideoSettings } from "./VideoSettings";

import styles from "./ProfileOverlay.module.scss";

type PasswordType = "oldPassword" | "newPassword" | "confirmNewPassword";
const PASSWORD_FIELDS: (keyof UserProfileModalFormDataPasswords)[] = [
  "oldPassword",
  "newPassword",
  "confirmNewPassword",
];
Object.freeze(PASSWORD_FIELDS);

type ProfileOverlayProps = {
  profile: WithId<User>;
};
export const ProfileOverlay: React.FC<ProfileOverlayProps> = ({ profile }) => {
  const [isSuccess, setSuccess] = useState(false);
  const checkOldPassword = useCheckOldPassword();
  const firebaseUser = firebase.auth()?.currentUser;
  const defaultValues = useProfileModalFormDefaultValues(profile);

  const {
    register,
    errors,
    setError,
    clearError,
    watch,
    handleSubmit,
    getValues,
    setValue,
    formState,
    control,
    reset,
  } = useForm<UserProfileModalFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    validateCriteriaMode: "all",
    defaultValues,
  });
  const values = getValues();

  const {
    fields: links,
    append: addLink,
    remove: removeLink,
  } = useFieldArray<ProfileLink>({
    control,
    name: formProp("profileLinks"),
  });

  useEffect(() => {
    if (defaultValues.partyName && !values.partyName) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, values]);

  const onDeleteLink = useCallback(
    (i: number) => {
      removeLink(i);
    },
    [removeLink]
  );

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

  const setLinkUrl = useCallback(
    (index: number, url: string) => {
      setValue(
        `${formProp("profileLinks")}[${index}].${propName<ProfileLink>("url")}`,
        url
      );
    },
    [setValue]
  );

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  }, [isSuccess]);

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
              !PASSWORD_FIELDS.includes(
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
        await updateUserProfile(
          firebaseUser.uid,
          pick(dataWithProfileLinks, changedFields)
        ).then(() => setSuccess(true));
      }
    },
    [
      firebaseUser,
      formState.dirtyFields,
      checkOldPassword,
      setError,
      clearError,
    ]
  );

  return (
    <div className={styles.ProfileOverlay__wrapper}>
      <div className={styles.ProfileOverlay__header}>Your profile settings</div>
      <div className={styles.ProfileOverlay__search}></div>
      <div className={styles.ProfileOverlay__content}>
        <ProfileModalEditBasicInfo
          user={profile}
          register={register}
          setValue={setValue}
          watch={watch}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ProfileModalEditLinks
            register={register}
            initialLinks={defaultValues.profileLinks ?? []}
            links={links}
            setLinkTitle={setLinkTitle}
            setLinkUrl={setLinkUrl}
            errors={errors?.profileLinks}
            onDeleteLink={onDeleteLink}
            onAddLink={addLinkHandler}
          />
          <VideoSettings register={register} />
          <AudioSettings register={register} />
          <ProfileModalChangePassword
            register={register}
            getValues={getValues}
            errors={pick<FieldErrors<UserProfileModalFormData>, PasswordType>(
              errors,
              PASSWORD_FIELDS
            )}
          />
          <div className={styles.ProfileOverlay__action}>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="alternativeBorder"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            <Button disabled={isSubmitting} variant="alternative">
              Cancel
            </Button>
            {isSuccess ? <span>✓ Saved</span> : ""}
          </div>
        </form>
      </div>
    </div>
  );
};
