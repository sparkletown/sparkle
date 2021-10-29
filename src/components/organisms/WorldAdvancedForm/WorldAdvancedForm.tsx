import React, { useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import * as Yup from "yup";

import { World } from "api/admin";
import { updateWorldAdvancedSettings } from "api/world";

import { WorldAdvancedFormInput } from "types/world";

import { WithId, withId } from "utils/id";

import { useUser } from "hooks/useUser";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarFooterProps } from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonProps } from "components/atoms/ButtonNG/ButtonNG";

import "./WorldAdvancedForm.scss";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = [];

const validationSchema = Yup.object().shape({});

export interface WorldAdvancedFormProps extends AdminSidebarFooterProps {
  world: WithId<World>;
}

export const WorldAdvancedForm: React.FC<WorldAdvancedFormProps> = ({
  world,
  ...sidebarFooterProps
}) => {
  const worldId = world.id;
  const { user } = useUser();

  const defaultValues = useMemo<WorldAdvancedFormInput>(
    () => ({
      attendeesTitle: world.attendeesTitle,
      chatTitle: world.chatTitle,
      showNametags: world.showNametags,
      showBadges: world.showBadges,
      showSchedule: world.showSchedule,
    }),
    [world]
  );

  const {
    reset,
    watch,
    formState: { dirty, isSubmitting },
    errors,
    handleSubmit,
    register,
  } = useForm<WorldAdvancedFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues,
  });

  const values = watch();

  const [{ error, loading: isSaving }, submit] = useAsyncFn(async () => {
    if (!values || !user || !worldId) return;
    await updateWorldAdvancedSettings(withId({ ...values }, worldId), user);

    reset(values);
  }, [values, user, worldId, reset]);

  const saveButtonProps: ButtonProps = useMemo(
    () => ({
      type: "submit",
      disabled: !dirty && !isSaving && !isSubmitting,
      loading: isSubmitting || isSaving,
    }),
    [dirty, isSaving, isSubmitting]
  );

  return (
    <div className="WorldAdvancedForm">
      <Form onSubmit={handleSubmit(submit)}>
        <AdminSidebarFooter
          {...sidebarFooterProps}
          saveButtonProps={saveButtonProps}
        />
        <AdminSection
          title="Title of your venues attendees"
          subtitle="(For example: guests, attendees, partygoers)"
          withLabel
        >
          <AdminInput
            name="attendeesTitle"
            autoComplete="off"
            placeholder="Attendees title"
            errors={errors}
            register={register}
          />
        </AdminSection>

        <AdminSection
          title="Your venue chat label"
          subtitle="(For example: Party, Event, Meeting)"
          withLabel
        >
          <AdminInput
            name="chatTitle"
            autoComplete="off"
            placeholder="Event label"
            errors={errors}
            register={register}
          />
        </AdminSection>

        <AdminSection
          title="Show Nametags (Display user names on their avatars)"
          withLabel
        >
          <Form.Control as="select" custom name="showNametags" ref={register}>
            <option value="none">None</option>
            <option value="hover">Inline and hover</option>
          </Form.Control>
        </AdminSection>

        <AdminSection>
          <AdminCheckbox
            name="showBadges"
            label="Show badges"
            variant="toggler"
            register={register}
          />
        </AdminSection>

        <AdminSection>
          <AdminCheckbox
            name="showRadio"
            label="Enable space radio"
            variant="toggler"
            errors={errors}
            register={register}
          />
          <AdminInput
            name="radioStations"
            errors={errors}
            register={register}
            label="Radio station stream URL:"
            disabled={!values.showRadio}
          />
        </AdminSection>

        <AdminSection>
          <AdminCheckbox
            name="hasSocialLoginEnabled"
            label="Social Login"
            subtext="Users can login using Google/Facebook/Okta social networks"
            variant="toggler"
            errors={errors}
            register={register}
          />
        </AdminSection>

        <AdminSection>
          <AdminCheckbox
            name="showSchedule"
            label="Show schedule"
            variant="toggler"
            register={register}
          />
        </AdminSection>

        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={error} />
      </Form>
    </div>
  );
};
