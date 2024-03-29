import React, { useMemo } from "react";
import { useFieldArray, useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/admin/Button";
import { Checkbox } from "components/admin/Checkbox";
import { EntranceStepsBuilder } from "components/admin/EntranceStepsBuilder";
import { InputGroup } from "components/admin/InputGroup";
import { QuestionsBuilder } from "components/admin/QuestionsBuilder";

import { updateWorldEntranceSettings, World } from "api/world";

import { EntranceStepTemplate } from "types/EntranceStep";
import { WorldEntranceFormInput } from "types/world";

import { WithId } from "utils/id";

import { worldEntranceSchema } from "forms/worldEntranceSchema";

import { AdminSidebarButtons } from "components/organisms/AdminVenueView/components/AdminSidebarButtons";

import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = ["entrance"];

export interface WorldEntranceFormProps {
  world: WithId<World>;
}

export const WorldEntranceForm: React.FC<WorldEntranceFormProps> = ({
  world,
}) => {
  const worldId = world.id;

  const defaultValues = useMemo<WorldEntranceFormInput>(
    () => ({
      code: world.questions?.code ?? [],
      entrance: world.entrance,
      adultContent: world.adultContent ?? false,
      requiresDateOfBirth: world.requiresDateOfBirth ?? false,
    }),
    [
      world.questions?.code,
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
    fields: entranceSteps,
    append: addEntranceStep,
    remove: removeEntranceStep,
  } = useFieldArray({ control, shouldUnregister: true, name: "entrance" });

  const handleAddEntranceQuestion = () =>
    addEntranceStep({
      template: EntranceStepTemplate.WelcomeVideo,
      videoUrl: "",
      autoplay: false,
    });
  const clearEntranceSteps = removeEntranceStep;

  const { isDirty, isSubmitting, errors } = useFormState({ control });

  const [{ error, loading: isSaving }, submit] = useAsyncFn(
    async (input: WorldEntranceFormInput) => {
      if (!worldId) return;

      const data = {
        ...input,
        id: worldId,
      };
      await updateWorldEntranceSettings(data);

      reset(data);
    },
    [worldId, reset]
  );

  const isSaveLoading = isSubmitting || isSaving;
  const isSaveDisabled = !(isDirty || isSaving || isSubmitting);

  return (
    <div data-bem="WorldEntranceForm">
      <form onSubmit={handleSubmit(submit)}>
        <Checkbox
          label="Restrict registration to 18+ (adds a date of birth picker)"
          name="requiresDateOfBirth"
          register={register}
        />

        <InputGroup title="Code of conduct questions">
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
        </InputGroup>

        <InputGroup title="Space Entrance">
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
        </InputGroup>

        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={error} />
        <AdminSidebarButtons>
          <Button
            variant="primary"
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
