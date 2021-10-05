import React from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { WORLD_ROOT_URL } from "settings";

import { createWorld, updateWorld, World } from "api/admin";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarFooterProps } from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";
import { AdminInput } from "components/organisms/WorldForm/components/AdminInput";
import { AdminSection } from "components/organisms/WorldForm/components/AdminSection";
import { FormErrors } from "components/organisms/WorldForm/components/FormErrors";

import { WorldFormValidationSchema } from "./WorldFormValidationSchema";

import "./WorldForm.scss";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS = ["name", "description"];

export interface WorldFormProps extends AdminSidebarFooterProps {
  world?: WithId<World>;
}

export const WorldForm: React.FC<WorldFormProps> = ({
  world,
  ...sidebarFooterProps
}) => {
  const createMode = !world?.id;
  const { user } = useUser();
  const {
    watch,
    formState: { dirty, isSubmitting },
    register,
    errors,
    handleSubmit,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: WorldFormValidationSchema,
    defaultValues: {
      name: "",
      description: "",
      subtitle: "",
      // bannerImageFile: undefined,
      // bannerImageUrl: "",
      // logoImageFile: undefined,
      // logoImageUrl: "",
      // mapBackgroundImageFile: undefined,
      // mapBackgroundImageUrl: "",
      ...world,
    },
  });

  const values = watch();

  const [{ error, loading: isSaving }, submit] = useAsyncFn(async () => {
    if (!values || !user) return;

    const save = createMode ? createWorld : updateWorld;

    const promise = save(
      {
        ...world,
        ...values,
      },
      user
    );

    // promise.then(console.log.bind(console, WorldForm.name, save.name));
    promise.catch(console.error.bind(console, WorldForm.name, save.name));

    await promise;
  }, [world, user, values, createMode]);

  // console.log(WorldForm.name, { world, errors, dirty, isSubmitting, values });
  if (error) {
    console.error(WorldForm.name, error);
  }

  return (
    <div className="WorldForm">
      <Form onSubmit={handleSubmit(submit)}>
        <AdminSection>
          <p>The URL of your world is:</p>
          <p>
            <span className="WorldForm__path-beginning">
              {window.location.host}
            </span>
            <span className="WorldForm__path-end WorldForm__name">
              {WORLD_ROOT_URL}/{values.name}
            </span>
          </p>
        </AdminSection>

        <AdminSection title="Name your world">
          <AdminInput
            label={
              <>
                What should we call this world?
                <span className="WorldForm__name">*</span>
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

        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />

        <AdminSidebarFooter
          {...sidebarFooterProps}
          saveButtonProps={{
            type: "submit",
            disabled: !dirty && !isSaving && !isSubmitting,
            loading: isSubmitting || isSaving,
          }}
        />
      </Form>
    </div>
  );
};
