import { useCallback, useEffect, useState } from "react";
import {
  FieldErrors,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import { useAsyncFn } from "react-use";
import { ProfileModalEditBasicInfo } from "components/attendee/BasicInfo/ProfileModalEditBasicInfo";
import { Button } from "components/attendee/Button/Button";
import { ProfileModalChangePassword } from "components/attendee/Password/ProfileModalChangePassword";
import { ProfileModalEditLinks } from "components/attendee/ProfileModalEditLinks/ProfileModalEditLinks";
import firebase from "firebase/compat/app";
import { omit, pick, uniq } from "lodash";

import {
  UserProfileModalFormData,
  UserProfileModalFormDataPasswords,
} from "types/profileModal";
import { ProfileLink, User } from "types/User";

import { WithId } from "utils/id";
import { isShallowEqual } from "utils/object";

import { useCheckOldPassword } from "hooks/useCheckOldPassword";
import { useProfileModalFormDefaultValues } from "hooks/useProfileModalFormDefaultValues";

import { updateUserProfile } from "pages/Account/helpers";

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
    setError,
    clearErrors,
    watch,
    handleSubmit,
    getValues,
    setValue,
    control,
    reset,
  } = useForm<UserProfileModalFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
    shouldUnregister: true,
  });

  const values = getValues();

  useEffect(() => {
    // needed to reset form values if default values served for the first time are incorrect
    if (
      !isShallowEqual(defaultValues, values) &&
      !Object.values(omit(values, "profileLinks")).filter((value) => !!value)
        .length
    ) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, values]);

  const { errors, dirtyFields } = useFormState<UserProfileModalFormData>({
    control,
  });

  const { fields: links, append: addLink } = useFieldArray({
    control,
    name: "profileLinks",
    shouldUnregister: true,
  });

  const addLinkHandler = useCallback(() => {
    addLink({ url: "", title: "" });
  }, [addLink]);

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
        profileLinks: [] as ProfileLink[],
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
        const data = pick(dataWithProfileLinks, changedFields);
        const validLinks = data.profileLinks?.filter(
          (link) => link.url && link.title !== ""
        );
        const requestDto = {
          ...data,
          profileLinks: data.profileLinks?.filter(
            (link) => link.url && link.title !== ""
          ),
        };
        await updateUserProfile(firebaseUser.uid, requestDto);
        reset({ ...values, profileLinks: validLinks });
        setSuccess(true);
      }
    },
    [
      firebaseUser,
      dirtyFields,
      checkOldPassword,
      setError,
      clearErrors,
      reset,
      values,
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
          watch={watch}
          setValue={setValue}
          partyNameError={errors?.partyName}
        />

        <div>
          <ProfileModalEditLinks
            register={register}
            links={links}
            errors={errors?.profileLinks}
            onAddLink={addLinkHandler}
          />
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
              onClick={handleSubmit(onSubmit)}
              variant="alternative"
              border="alternative"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            <Button disabled={isSubmitting} variant="alternative">
              Cancel
            </Button>
            {isSuccess ? <span>✓ Saved</span> : ""}
          </div>
        </div>
      </div>
    </div>
  );
};
