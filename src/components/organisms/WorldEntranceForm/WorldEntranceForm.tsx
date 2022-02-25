import React, { useCallback, useMemo } from "react";
import { useFieldArray, useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { TesterRestricted } from "components/shared/TesterRestricted";

import { updateWorldEntranceSettings, World } from "api/world";

import { EntranceStepTemplate } from "types/EntranceStep";
import { WorldEntranceFormInput } from "types/world";

import { WithId } from "utils/id";

import { worldEntranceSchema } from "forms/worldEntranceSchema";

import { useUser } from "hooks/useUser";

import { AdminSidebarButtons } from "components/organisms/AdminVenueView/components/AdminSidebarButtons";
import { EntranceStepsBuilder } from "components/organisms/EntranceStepsBuilder";
import { QuestionsBuilder } from "components/organisms/QuestionsBuilder";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminSection } from "components/molecules/AdminSection";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";

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

  const defaultValues = useMemo<WorldEntranceFormInput>(
    () => ({
      code: world.questions?.code ?? [],
      profile: world.questions?.profile ?? [],
      entrance: world.entrance,
      adultContent: world.adultContent ?? false,
      requiresDateOfBirth: world.requiresDateOfBirth ?? false,
    }),
    [
      world.questions?.code,
      world.questions?.profile,
      world.entrance,
      world.adultContent,
      world.requiresDateOfBirth,
    ]
  );

  const {
    reset,
    register,
    handleSubmit,
    control,
  } = useForm<WorldEntranceFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(worldEntranceSchema),
    defaultValues,
  });

  const {
    fields: codeQuestions,
    append: addCodeQuestion,
    remove: removeCodeQuestion,
  } = useFieldArray({ control, shouldUnregister: true, name: "code" });

  const handleAddCodeQuestion = () =>
    addCodeQuestion({ name: "", text: "", link: "" });
  const clearCodeQuestions = removeCodeQuestion;

  const {
    fields: profileQuestions,
    append: addProfileQuestion,
    remove: removeProfileQuestion,
  } = useFieldArray({ control, shouldUnregister: true, name: "profile" });

  const handleAddProfileQuestion = useCallback(
    () => addProfileQuestion({ name: "", text: "", link: "" }),
    [addProfileQuestion]
  );
  const clearProfileQuestions = removeProfileQuestion;
  const {
    fields: entranceSteps,
    append: addEntranceStep,
    remove: removeEntranceStep,
  } = useFieldArray({ control, shouldUnregister: true, name: "entrance" });

  const handleAddEntranceQuestion = () =>
    addEntranceStep({
      template: EntranceStepTemplate.WelcomeVideo,
      videoUrl: "",
      autoplay: false,
      welcomeText: "",
    });
  const clearEntranceSteps = removeEntranceStep;

  const { isDirty, isSubmitting, errors } = useFormState({ control });

  const [{ error, loading: isSaving }, submit] = useAsyncFn(
    async (input: WorldEntranceFormInput) => {
      if (!user || !worldId) return;

      const data = {
        ...input,
        id: worldId,
      };
      await updateWorldEntranceSettings(data, user);

      reset(data);
    },
    [worldId, user, reset]
  );

  const isSaveLoading = isSubmitting || isSaving;
  const isSaveDisabled = !(isDirty || isSaving || isSubmitting);

  return (
    <div className="WorldEntranceForm">
      <form onSubmit={handleSubmit(submit)}>
        <AdminSection title="Limit access to world">
          <TesterRestricted>
            <AdminCheckbox
              variant="toggler"
              label="Restrict entry to adults aged 18+"
              name="adultContent"
              register={register}
            />
          </TesterRestricted>
          <AdminCheckbox
            label={
              <>
                Restrict registration to 18+
                <br />
                (adds a date of birth picker)
              </>
            }
            name="requiresDateOfBirth"
            register={register}
          />
        </AdminSection>
        <AdminSection title="Code of conduct questions">
          <QuestionsBuilder
            errors={errors.code}
            hasLink
            items={codeQuestions}
            name="code"
            onAdd={handleAddCodeQuestion}
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
            onAdd={handleAddProfileQuestion}
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
            onAdd={handleAddEntranceQuestion}
            onRemove={removeEntranceStep}
            onClear={clearEntranceSteps}
            register={register}
            control={control}
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
      </form>
    </div>
  );
};
