import React, { useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import * as Yup from "yup";

import { World } from "api/admin";
import { updateWorldEntranceSettings } from "api/world";

import { WorldEntranceFormInput } from "types/world";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarFooterProps } from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";

import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonProps } from "components/atoms/ButtonNG/ButtonNG";

import "./WorldEntranceForm.scss";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = [];

const validationSchema = Yup.object().shape({});

export interface WorldEntranceFormProps extends AdminSidebarFooterProps {
  world: WithId<World>;
}

export const WorldEntranceForm: React.FC<WorldEntranceFormProps> = ({
  world,
  ...sidebarFooterProps
}) => {
  const worldId = world.slug;
  const { user } = useUser();

  const defaultValues = useMemo<WorldEntranceFormInput>(
    () => ({
      profile_questions: [],
      code_of_conduct_questions: [],
    }),
    []
  );

  const {
    reset,
    watch,
    formState: { dirty, isSubmitting },
    errors,
    handleSubmit,
  } = useForm<WorldEntranceFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues,
  });

  const values = watch();

  const [{ error, loading: isSaving }, submit] = useAsyncFn(async () => {
    if (!values || !user || !worldId) return;

    await updateWorldEntranceSettings({ ...values, id: world.slug }, user);

    reset(defaultValues);
  }, [values, user, worldId, world.slug, reset, defaultValues]);

  const saveButtonProps: ButtonProps = useMemo(
    () => ({
      type: "submit",
      disabled: !dirty && !isSaving && !isSubmitting,
      loading: isSubmitting || isSaving,
    }),
    [dirty, isSaving, isSubmitting]
  );

  return (
    <div className="WorldEntranceForm">
      <Form onSubmit={handleSubmit(submit)}>
        <AdminSidebarFooter
          {...sidebarFooterProps}
          saveButtonProps={saveButtonProps}
        />
        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={error} />
      </Form>
    </div>
  );
};
