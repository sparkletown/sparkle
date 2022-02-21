import React, { useMemo } from "react";
import { useFieldArray, useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";

import { updateWorldAdvancedSettings, World } from "api/world";

import { UserStatus } from "types/User";
import { WorldAdvancedFormInput } from "types/world";

import { WithId, withId } from "utils/id";
import { shouldScheduleBeShown } from "utils/schedule";

import { emptyObjectSchema } from "forms/emptyObjectSchema";

import { useUser } from "hooks/useUser";

import { AdminSidebarButtons } from "components/organisms/AdminVenueView/components/AdminSidebarButtons";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { AdminUserStatusInput } from "components/molecules/AdminUserStatusInput";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./WorldAdvancedForm.scss";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = [];

export interface WorldAdvancedFormProps {
  world: WithId<World>;
}

export const WorldAdvancedForm: React.FC<WorldAdvancedFormProps> = ({
  world,
}) => {
  const worldId = world.id;
  const { user } = useUser();

  const defaultValues = useMemo<WorldAdvancedFormInput>(
    () => ({
      attendeesTitle: world.attendeesTitle,
      radioStation: world.radioStations?.[0],
      showBadges: world.showBadges,
      showRadio: world.showRadio,
      showSchedule: shouldScheduleBeShown(world),
      showUserStatus: world.showUserStatus,
      userStatuses: world.userStatuses,
      hasSocialLoginEnabled: world.hasSocialLoginEnabled,
    }),
    [world]
  );

  const {
    reset,
    watch,
    control,
    handleSubmit,
    register,
  } = useForm<WorldAdvancedFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(emptyObjectSchema),
    defaultValues,
  });

  const {
    fields: userStatuses,
    append: appendStatus,
    update: updateStatus,
    remove: removeStatus,
  } = useFieldArray({ control, name: "userStatuses", shouldUnregister: true });

  const handleAddStatus = () => {
    appendStatus({ status: "", color: "" });
  };

  const { isDirty, isSubmitting, errors } = useFormState({ control });

  const values = watch();

  const [{ error, loading: isSaving }, submit] = useAsyncFn(async () => {
    if (!values || !user || !worldId) return;

    await updateWorldAdvancedSettings(withId(values, worldId), user);

    reset(values);
  }, [worldId, user, values, reset]);

  const isSaveLoading = isSubmitting || isSaving;
  const isSaveDisabled = !(isDirty || isSaving || isSubmitting);

  const renderedUserStatuses = useMemo(
    () =>
      userStatuses.map((userStatus, index) => {
        const key = `${userStatus}-${index}`;

        const handleChange = (item: UserStatus) => updateStatus(index, item);
        const handleRemove = () => removeStatus(index);

        return (
          <AdminUserStatusInput
            key={key}
            index={index}
            item={userStatuses[index]}
            register={register}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        );
      }),
    [userStatuses, updateStatus, removeStatus, register]
  );

  return (
    <div className="WorldAdvancedForm">
      <form onSubmit={handleSubmit(submit)}>
        <AdminSection
          title="Title of your venues attendees"
          subtitle="(For example: guests, attendees, partygoers)"
          withLabel
        >
          <AdminInput
            autoComplete="off"
            placeholder="Attendees title"
            errors={errors}
            name="attendeesTitle"
            register={register}
          />
        </AdminSection>

        <AdminSection>
          <AdminCheckbox
            label="Show badges"
            variant="toggler"
            name="showBadges"
            register={register}
          />
        </AdminSection>

        <AdminSection>
          <AdminCheckbox
            label="Enable space radio"
            variant="toggler"
            errors={errors}
            name="showRadio"
            register={register}
          />
          <AdminInput
            errors={errors}
            name="radioStation"
            register={register}
            label="Radio station stream URL:"
            hidden={!values.showRadio}
          />
        </AdminSection>

        <AdminSection>
          <AdminCheckbox
            label="Social Login"
            subtext="Users can login using Google/Facebook/Okta social networks"
            variant="toggler"
            errors={errors}
            name="hasSocialLoginEnabled"
            register={register}
          />
        </AdminSection>

        <AdminSection>
          <AdminCheckbox
            label="Show schedule"
            variant="toggler"
            name="showSchedule"
            register={register}
          />
        </AdminSection>

        <AdminSection>
          <AdminCheckbox
            label="Show user status"
            variant="toggler"
            name="showUserStatus"
            register={register}
          />
          {values.showUserStatus && (
            <>
              {renderedUserStatuses}
              <ButtonNG
                variant="primary"
                iconName={faPlus}
                onClick={handleAddStatus}
              >
                Add a status
              </ButtonNG>
            </>
          )}
        </AdminSection>

        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={error} />
        <AdminSidebarButtons>
          <ButtonNG
            className="AdminSidebar__button--larger"
            variant="primary"
            type="submit"
            disabled={isSaveDisabled}
            loading={isSaveLoading}
          >
            Save
          </ButtonNG>
        </AdminSidebarButtons>
      </form>
    </div>
  );
};
