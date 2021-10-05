import React, { useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import * as Yup from "yup";

import { WORLD_ROOT_URL } from "settings";

import { createWorld, updateWorld, World } from "api/admin";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarFooterProps } from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";

import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { FormErrors } from "components/molecules/FormErrors";

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

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
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
  const worldId = world?.id;
  const createMode = !worldId;
  const { user } = useUser();

  const defaultValues = useMemo(
    () => ({
      name: world?.name,
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
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues,
  });

  const values = watch();

  const [{ error, loading: isSaving }, submit] = useAsyncFn(async () => {
    if (!values || !user) return;
    if (!createMode || !worldId) return;

    if (createMode) {
      await createWorld(values, user);
    } else {
      await updateWorld({ ...values, id: worldId }, user);
    }

    reset(defaultValues);
  }, [worldId, user, values, reset, createMode, defaultValues]);

  if (error) {
    console.error(WorldStartForm.name, error);
  }

  return (
    <div className="WorldStartForm">
      <Form onSubmit={handleSubmit(submit)}>
        <AdminSidebarFooter
          {...sidebarFooterProps}
          saveButtonProps={{
            type: "submit",
            disabled: !dirty && !isSaving && !isSubmitting,
            loading: isSubmitting || isSaving,
          }}
        />
        <AdminSection>
          <p>The URL of your world is:</p>
          <p>
            <span className="WorldStartForm__path-beginning">
              {window.location.host}
            </span>
            <span className="WorldStartForm__path-end WorldStartForm__name">
              {WORLD_ROOT_URL}/{values.name}
            </span>
          </p>
        </AdminSection>
        <AdminSection title="Name your world">
          <AdminInput
            label={
              <>
                What should we call this world?
                <span className="WorldStartForm__name">*</span>
              </>
            }
            name="name"
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
              <span>Upload Highlight image</span>{" "}
              <span className="WorldStartForm__subdued">(optional)</span>
            </>
          }
        >
          <div className="WorldStartForm__banner-wrapper">
            <ImageInput
              name="bannerImage"
              imgUrl={values.bannerImageFile}
              error={errors.bannerImageFile || errors.bannerImageUrl}
              isInputHidden={!values.bannerImageUrl}
              register={register}
              setValue={setValue}
            />
          </div>
        </AdminSection>
        <AdminSection
          title={
            <>
              <span>Upload your logo</span>{" "}
              <span className="WorldStartForm__subdued">(optional)</span>
            </>
          }
        >
          <div className="WorldStartForm__logo-wrapper">
            <ImageInput
              name="logoImage"
              imgUrl={values?.logoImageUrl}
              error={errors.logoImageFile || errors.logoImageUrl}
              setValue={setValue}
              register={register}
              small
            />
          </div>
        </AdminSection>
        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
      </Form>
    </div>
  );
};
