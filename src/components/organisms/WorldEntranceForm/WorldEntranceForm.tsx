import React, { useEffect, useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { updateWorldEntranceSettings, World } from "api/world";

import { EntranceStepConfig, EntranceStepTemplate } from "types/EntranceStep";
import { Question } from "types/Question";
import { WorldEntranceFormInput } from "types/world";

import { WithId } from "utils/id";

import { worldEntranceSchema } from "forms/worldEntranceSchema";

import { useArray } from "hooks/useArray";
import { useUser } from "hooks/useUser";

import { AdminSidebarButtons } from "components/organisms/AdminVenueView/components/AdminSidebarButtons";
import { EntranceStepsBuilder } from "components/organisms/EntranceStepsBuilder";
import { QuestionsBuilder } from "components/organisms/QuestionsBuilder";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminSection } from "components/molecules/AdminSection";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import { TesterRestricted } from "components/atoms/TesterRestricted";

import "./WorldEntranceForm.scss";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = ["entrance"];

export interface WorldEntranceFormProps {
  world: WithId<World>;
}

export const WorldEntranceForm: React.FC<WorldEntranceFormProps> = ({
  world,
}) => {
  const worldId = world.id;
  const { user } = useUser();

  // @debt sync useArray with the form changes or try useFieldArray
  const {
    items: codeQuestions,
    add: addCodeQuestion,
    update: updateCodeQuestion,
    clear: clearCodeQuestions,
    remove: removeCodeQuestion,
    isDirty: isDirtyCode,
    clearDirty: clearDirtyCode,
  } = useArray<Question>(world.questions?.code);

  const {
    items: profileQuestions,
    add: addProfileQuestion,
    update: updateProfileQuestion,
    clear: clearProfileQuestions,
    remove: removeProfileQuestion,
    isDirty: isDirtyProfile,
    clearDirty: clearDirtyProfile,
  } = useArray<Question>(world.questions?.profile);

  const {
    items: entranceSteps,
    add: addEntranceStep,
    update: updateEntranceStep,
    clear: clearEntranceSteps,
    remove: removeEntranceStep,
    isDirty: isDirtyEntrance,
    clearDirty: clearDirtyEntrance,
  } = useArray<EntranceStepConfig>(world.entrance, {
    create: () => ({ template: EntranceStepTemplate.WelcomeVideo }),
    prepare: (item) => ({
      ...item,
      template: item.template || EntranceStepTemplate.WelcomeVideo,
    }),
  });

  const defaultValues = useMemo<WorldEntranceFormInput>(
    () => ({
      code: codeQuestions,
      profile: profileQuestions,
      entrance: entranceSteps,
      adultContent: world.adultContent ?? false,
      requiresDateOfBirth: world.requiresDateOfBirth ?? false,
    }),
    [
      codeQuestions,
      profileQuestions,
      entranceSteps,
      world.adultContent,
      world.requiresDateOfBirth,
    ]
  );

  const {
    getValues,
    reset,
    register,
    formState: { dirty, isSubmitting },
    errors,
    handleSubmit,
  } = useForm<WorldEntranceFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: worldEntranceSchema,
    defaultValues,
  });

  const [{ error, loading: isSaving }, submit] = useAsyncFn(
    async (input: WorldEntranceFormInput) => {
      if (!user || !worldId) return;

      const data = {
        ...input,
        id: worldId,
        code: codeQuestions,
        profile: profileQuestions,
        entrance: entranceSteps,
      };
      await updateWorldEntranceSettings(data, user);

      reset(data);
      clearDirtyCode();
      clearDirtyProfile();
      clearDirtyEntrance();
    },
    [
      worldId,
      user,
      reset,
      clearDirtyCode,
      clearDirtyProfile,
      clearDirtyEntrance,
      codeQuestions,
      profileQuestions,
      entranceSteps,
    ]
  );

  const isSaveLoading = isSubmitting || isSaving;
  const isSaveDisabled = !(
    dirty ||
    isSaving ||
    isSubmitting ||
    isDirtyCode ||
    isDirtyProfile ||
    isDirtyEntrance
  );

  useEffect(() => {
    const values: Partial<WorldEntranceFormInput> = getValues();

    reset({
      code: codeQuestions,
      profile: profileQuestions,
      entrance: entranceSteps,
      adultContent: values.adultContent ?? false,
      requiresDateOfBirth: values.requiresDateOfBirth ?? false,
    });
  }, [codeQuestions, profileQuestions, entranceSteps, getValues, reset]);

  return (
    <div className="WorldEntranceForm">
      <Form onSubmit={handleSubmit(submit)}>
        <AdminSection title="Limit access to world">
          <TesterRestricted>
            <AdminCheckbox
              variant="toggler"
              name="adultContent"
              label="Restrict entry to adults aged 18+"
              register={register}
            />
          </TesterRestricted>
          <AdminCheckbox
            name="requiresDateOfBirth"
            label={
              <>
                Restrict registration to 18+
                <br />
                (adds a date of birth picker)
              </>
            }
            register={register}
          />
        </AdminSection>
        <AdminSection title="Code of conduct questions">
          <QuestionsBuilder
            errors={errors.code}
            hasLink
            items={codeQuestions}
            name="code"
            onAdd={addCodeQuestion}
            onUpdate={updateCodeQuestion}
            onRemove={removeCodeQuestion}
            onClear={clearCodeQuestions}
            register={register}
          />
        </AdminSection>
        <AdminSection title="Profile questions">
          <QuestionsBuilder
            errors={errors.profile}
            items={profileQuestions}
            name="profile"
            onAdd={addProfileQuestion}
            onUpdate={updateProfileQuestion}
            onRemove={removeProfileQuestion}
            onClear={clearProfileQuestions}
            register={register}
          />
        </AdminSection>
        <AdminSection title="Space Entrance">
          <EntranceStepsBuilder
            errors={errors.entrance}
            items={entranceSteps}
            name="entrance"
            onAdd={addEntranceStep}
            onUpdate={updateEntranceStep}
            onRemove={removeEntranceStep}
            onClear={clearEntranceSteps}
            register={register}
          />
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
      </Form>
    </div>
  );
};
