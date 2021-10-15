import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useAsyncFn } from "react-use";
import { omit } from "lodash";
import * as Yup from "yup";

import { ADMIN_V3_WORLDS_URL } from "settings";

import { createUrlSafeName, World } from "api/admin";
import { createWorld, updateWorldStartSettings } from "api/world";

import { worldEdit, WorldEditActions } from "store/actions/WorldEdit";

import { WorldStartFormInput } from "types/world";

import { WithId, WithOptionalWorldId } from "utils/id";

import { useDispatch } from "hooks/useDispatch";
import { useUser } from "hooks/useUser";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarFooterProps } from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";

import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonProps } from "components/atoms/ButtonNG/ButtonNG";
import ImageInput from "components/atoms/ImageInput";

import "./WorldStartForm.scss";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS = [
  "name",
  "description",
  "bannerImageFile",
  "bannerImageUrl",
  "logoImageFile",
  "logoImageUrl",
];

// NOTE: file objects are being mutated, so they aren't a good fit for redux store
const UNWANTED_FIELDS = ["logoImageFile", "bannerImageFile"];

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required()
    .test(
      "name",
      "Must have alphanumeric characters",
      (val: string) => createUrlSafeName(val).length > 0
    ),
  description: Yup.string().notRequired(),
  subtitle: Yup.string().notRequired(),
  bannerImageFile: Yup.mixed<FileList>().notRequired(),
  bannerImageUrl: Yup.string(),
  logoImageFile: Yup.mixed<FileList>().notRequired(),
  logoImageUrl: Yup.string(),
});

export interface WorldStartFormProps extends AdminSidebarFooterProps {
  world?: WithId<World>;
}

export const WorldStartForm: React.FC<WorldStartFormProps> = ({
  world,
  ...sidebarFooterProps
}) => {
  const [worldId, setWorldId] = useState(world?.id);
  const history = useHistory();
  const { user } = useUser();

  const defaultValues = useMemo<WorldStartFormInput>(
    () => ({
      name: world?.name ?? "",
      description: world?.config?.landingPageConfig?.description,
      subtitle: world?.config?.landingPageConfig?.subtitle,
      bannerImageFile: undefined,
      bannerImageUrl: world?.config?.landingPageConfig?.coverImageUrl,
      logoImageFile: undefined,
      logoImageUrl: world?.host?.icon,
    }),
    [world]
  );

  const {
    setValue,
    reset,
    watch,
    formState: { dirty, isSubmitting },
    register,
    errors,
    handleSubmit,
  } = useForm<WorldStartFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues,
  });

  const values = watch();

  const [{ error, loading: isSaving }, submit] = useAsyncFn(async () => {
    if (!values || !user) return;

    if (worldId) {
      await updateWorldStartSettings({ ...values, id: worldId }, user);
      //TODO: Change this to the most appropriate url when product decides the perfect UX
      history.push(ADMIN_V3_WORLDS_URL);
    } else {
      const { worldId: id, error } = await createWorld(values, user);

      if (id) {
        setWorldId(id);
      }

      if (error) {
        // Note, a more complex option when id exists is a redirect
        // that doesn't lose the error message for the user
        throw error;
      }

      //TODO: Change this to the most appropriate url when product decides the perfect UX
      history.push(ADMIN_V3_WORLDS_URL);
    }

    reset(defaultValues);
  }, [worldId, user, values, reset, defaultValues, history]);

  const saveButtonProps: ButtonProps = useMemo(
    () => ({
      type: "submit",
      disabled: !dirty && !isSaving && !isSubmitting,
      loading: isSubmitting || isSaving,
    }),
    [dirty, isSaving, isSubmitting]
  );

  const dispatch = useDispatch();
  const handleChange = useCallback(
    // if form onChange called -> ignore first arg
    // if image onChange called -> use second arg
    (_, { nameUrl, valueUrl } = {}) =>
      dispatch<WorldEditActions>(
        worldEdit({
          ...omit(values, UNWANTED_FIELDS),
          [nameUrl]: valueUrl,
          worldId,
        } as WithOptionalWorldId<WorldStartFormInput>)
      ),
    [values, worldId, dispatch]
  );

  // NOTE: palette cleanser when starting new world, run only once on init
  useEffect(() => void dispatch<WorldEditActions>(worldEdit()), [dispatch]);

  return (
    <div className="WorldStartForm">
      <Form onSubmit={handleSubmit(submit)} onChange={handleChange}>
        <AdminSidebarFooter
          {...sidebarFooterProps}
          saveButtonProps={saveButtonProps}
        />
        <AdminSection title="Name your world" withLabel>
          <AdminInput
            name="name"
            subtext="If you are hosting an event, use the event name."
            placeholder="World or Event Name"
            register={register}
            errors={errors}
          />
        </AdminSection>
        <AdminSection title="Add a subtitle">
          <AdminInput
            label="What should be the subtitle?"
            name="subtitle"
            register={register}
            errors={errors}
          />
        </AdminSection>
        <AdminSection title="Describe your world">
          <AdminInput
            label="How should we describe this world?"
            name="description"
            register={register}
            errors={errors}
          />
        </AdminSection>
        <AdminSection
          title={
            <>
              Upload Highlight image &nbsp;
              <span className="mod--subdued">(optional)</span>
            </>
          }
          subtitle="A plain 1920 x 1080px image works best."
        >
          <ImageInput
            name="bannerImage"
            imgUrl={values.bannerImageUrl}
            error={errors.bannerImageFile || errors.bannerImageUrl}
            isInputHidden={!values.bannerImageUrl}
            register={register}
            setValue={setValue}
            onChange={handleChange}
          />
        </AdminSection>
        <AdminSection
          title={
            <>
              Upload your logo &nbsp;
              <span className="mod--subdued">(optional)</span>
            </>
          }
          subtitle="A 400 px square image works best."
        >
          <ImageInput
            name="logoImage"
            imgUrl={values?.logoImageUrl}
            error={errors.logoImageFile || errors.logoImageUrl}
            setValue={setValue}
            register={register}
            small
            onChange={handleChange}
          />
        </AdminSection>
        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={error} />
      </Form>
    </div>
  );
};
