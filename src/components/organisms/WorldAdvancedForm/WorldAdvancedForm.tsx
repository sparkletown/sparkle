import React, { useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import * as Yup from "yup";

import { World } from "api/admin";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarFooterProps } from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";

import { FormErrors } from "components/molecules/FormErrors";

import "./WorldAdvancedForm.scss";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = [];

const validationSchema = Yup.object().shape({});

export interface WorldAdvancedFormProps extends AdminSidebarFooterProps {
  world?: WithId<World>;
}

export const WorldAdvancedForm: React.FC<WorldAdvancedFormProps> = ({
  world,
  ...sidebarFooterProps
}) => {
  const worldId = world?.id;
  const createMode = !worldId;
  const { user } = useUser();

  const defaultValues = useMemo(() => ({}), []);

  const {
    reset,
    watch,
    formState: { dirty, isSubmitting },
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

    // await updateWorld({ ...values, id: worldId }, user);

    reset(defaultValues);
  }, [worldId, user, values, reset, createMode, defaultValues]);

  if (error) {
    console.error(WorldAdvancedForm.name, error);
  }

  return (
    <div className="WorldAdvancedForm">
      <Form onSubmit={handleSubmit(submit)}>
        <AdminSidebarFooter
          {...sidebarFooterProps}
          saveButtonProps={{
            type: "submit",
            disabled: !dirty && !isSaving && !isSubmitting,
            loading: isSubmitting || isSaving,
          }}
        />
        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
      </Form>
    </div>
  );
};
