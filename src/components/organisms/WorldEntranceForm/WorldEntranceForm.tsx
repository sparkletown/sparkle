import React, { useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import * as Yup from "yup";

import { World } from "api/admin";
import { updateWorldEntranceSettings } from "api/world";

import { Question } from "types/Question";
import { WorldEntranceFormInput } from "types/world";

import { WithId } from "utils/id";

import { useArray } from "hooks/useArray";
import { useUser } from "hooks/useUser";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarFooterProps } from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";
import { QuestionsBuilder } from "components/organisms/QuestionsBuilder";

import { AdminSection } from "components/molecules/AdminSection";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonProps } from "components/atoms/ButtonNG/ButtonNG";

import "./WorldEntranceForm.scss";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = [];

const questionScheme = Yup.array<Question>()
  .ensure()
  .defined()
  .transform((value) =>
    value.filter(({ name, text }: Question) => !!name && !!text)
  );

const validationSchema = Yup.object().shape({
  code_of_conduct_questions: questionScheme,
  profile_questions: questionScheme,
  entrance: Yup.array(
    Yup.object().shape({
      videoUrl: Yup.string().required("Video URL is required."),
      autoplay: Yup.boolean().notRequired(),
      buttons: Yup.array(
        Yup.object().shape({
          isProceed: Yup.boolean().required(),
          text: Yup.string().notRequired(),
          href: Yup.string().notRequired(),
        })
      ),
    })
  ),
});

export interface WorldEntranceFormProps extends AdminSidebarFooterProps {
  world: WithId<World>;
}

export const WorldEntranceForm: React.FC<WorldEntranceFormProps> = ({
  world,
  ...sidebarFooterProps
}) => {
  const worldId = world.id;
  const { user } = useUser();

  // @debt sync useArray with the form changes or try useFieldArray
  const {
    items: codeQuestions,
    add: addCodeQuestion,
    clear: clearCodeQuestions,
    remove: removeCodeQuestion,
  } = useArray<Question>(
    world.questions?.code ?? world.code_of_conduct_questions
  );

  const {
    items: profileQuestions,
    add: addProfileQuestion,
    clear: clearProfileQuestions,
    remove: removeProfileQuestion,
  } = useArray<Question>(world.questions?.profile ?? world.profile_questions);

  const defaultValues = useMemo<WorldEntranceFormInput>(
    () => ({
      code: codeQuestions,
      profile: profileQuestions,
    }),
    [codeQuestions, profileQuestions]
  );

  const {
    control,
    reset,
    register,
    formState: { dirty, isSubmitting },
    errors,
    handleSubmit,
  } = useForm<WorldEntranceFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues,
  });

  const [{ error, loading: isSaving }, submit] = useAsyncFn(
    async (input: WorldEntranceFormInput) => {
      if (!user || !worldId) return;

      await updateWorldEntranceSettings({ ...input, id: worldId }, user);

      reset(defaultValues);
    },
    [worldId, user, reset, defaultValues]
  );

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
        <AdminSection title="Code of conduct questions">
          <QuestionsBuilder
            errors={errors}
            hasLink
            count={codeQuestions.length}
            name="code"
            onAdd={addCodeQuestion}
            onRemove={removeCodeQuestion}
            onClear={clearCodeQuestions}
            register={register}
            control={control}
          />
        </AdminSection>
        <AdminSection title="Profile questions">
          <QuestionsBuilder
            errors={errors}
            count={profileQuestions.length}
            name="profile"
            onAdd={addProfileQuestion}
            onRemove={removeProfileQuestion}
            onClear={clearProfileQuestions}
            register={register}
          />
        </AdminSection>
        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={error} />
      </Form>
    </div>
  );
};
