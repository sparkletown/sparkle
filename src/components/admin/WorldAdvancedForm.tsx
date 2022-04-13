import React, { useMemo } from "react";
import { useFieldArray, useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/admin/Button";
import { Checkbox } from "components/admin/Checkbox";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";
import { UserStatusInput } from "components/admin/UserStatusInput";

import { updateWorldAdvancedSettings, World } from "api/world";

import { UserStatus } from "types/User";
import { WorldAdvancedFormInput } from "types/world";

import { WithId, withId } from "utils/id";
import { shouldScheduleBeShown } from "utils/schedule";

import { emptyObjectSchema } from "forms/emptyObjectSchema";

import { useLiveUser } from "hooks/user/useLiveUser";

import { AdminSidebarButtons } from "components/organisms/AdminVenueView/components/AdminSidebarButtons";

import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = [];

export interface WorldAdvancedFormProps {
  world: WithId<World>;
}

export const WorldAdvancedForm: React.FC<WorldAdvancedFormProps> = ({
  world,
}) => {
  const worldId = world.id;
  const { user } = useLiveUser();

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
  const isSaveDisabled = !isDirty || isSaving || isSubmitting;

  const renderedUserStatuses = useMemo(
    () =>
      userStatuses.map((userStatus, index) => {
        const key = `${userStatus}-${index}`;

        const handleChange = (item: UserStatus) => updateStatus(index, item);
        const handleRemove = () => removeStatus(index);

        return (
          <UserStatusInput
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
        <InputGroup
          title="Title of your venues attendees"
          subtitle="(For example: guests, attendees, partygoers)"
          withLabel
        >
          <Input
            autoComplete="off"
            placeholder="Attendees title"
            errors={errors}
            name="attendeesTitle"
            register={register}
          />
        </InputGroup>

        <Checkbox
          label="Show badges"
          variant="toggler"
          name="showBadges"
          register={register}
        />

        <Checkbox
          label="Enable space radio"
          variant="toggler"
          errors={errors}
          name="showRadio"
          register={register}
        />
        {values.showRadio && (
          <InputGroup title="Radio station stream URL:">
            <Input errors={errors} name="radioStation" register={register} />
          </InputGroup>
        )}

        <Checkbox
          label="Social Login"
          subtext="Users can login using Google/Facebook/Okta social networks"
          variant="toggler"
          errors={errors}
          name="hasSocialLoginEnabled"
          register={register}
        />

        <Checkbox
          label="Show schedule"
          variant="toggler"
          name="showSchedule"
          register={register}
        />

        <Checkbox
          label="Show user status"
          variant="toggler"
          name="showUserStatus"
          register={register}
        />
        {values.showUserStatus && (
          <>
            {renderedUserStatuses}
            <Button variant="primary" onClick={handleAddStatus}>
              Add a status
            </Button>
          </>
        )}

        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={error} />

        <AdminSidebarButtons>
          <Button
            type="submit"
            disabled={isSaveDisabled}
            loading={isSaveLoading}
          >
            {isSaveLoading ? "Saving..." : "Save"}
          </Button>
        </AdminSidebarButtons>
      </form>
    </div>
  );
};
