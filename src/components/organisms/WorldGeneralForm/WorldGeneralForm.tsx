import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useAsyncFn } from "react-use";
import { omit } from "lodash";

import { ADMIN_V3_WORLDS_BASE_URL, COMMON_NAME_MAX_CHAR_COUNT } from "settings";

import { createWorld, updateWorldStartSettings, World } from "api/world";

import { worldEdit, WorldEditActions } from "store/actions/WorldEdit";

import { WorldGeneralFormInput } from "types/world";

import { WithId, WithOptionalWorldId } from "utils/id";

import { worldStartSchema } from "forms/worldStartSchema";

import { useDispatch } from "hooks/useDispatch";
import { useUser } from "hooks/useUser";

import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG, ButtonProps } from "components/atoms/ButtonNG/ButtonNG";
import ImageInput from "components/atoms/ImageInput";

import "./WorldGeneralForm.scss";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS = [
  "name",
  "description",
  "bannerImageFile",
  "bannerImageUrl",
  "logoImageFile",
  "logoImageUrl",
];

// NOTE: file objects are being mutated, so they aren't a good fit for redux store
const UNWANTED_FIELDS = ["logoImageFile", "bannerImageFile"];

export interface WorldGeneralFormProps {
  world?: WithId<World>;
}

export const WorldGeneralForm: React.FC<WorldGeneralFormProps> = ({
  world,
}) => {
  const [worldId, setWorldId] = useState(world?.id);
  const history = useHistory();
  const { user } = useUser();

  const defaultValues = useMemo<WorldGeneralFormInput>(
    () => ({
      name: world?.name ?? "",
      description: world?.config?.landingPageConfig?.description,
      subtitle: world?.config?.landingPageConfig?.subtitle,
      bannerImageFile: undefined,
      bannerImageUrl: world?.config?.landingPageConfig?.coverImageUrl ?? "",
      logoImageFile: undefined,
      logoImageUrl: world?.host?.icon ?? "",
    }),
    [world]
  );

  const {
    setValue,
    reset,
    watch,
    formState: { dirty, isSubmitting },
    register,
    errors,
    handleSubmit,
  } = useForm<WorldGeneralFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: worldStartSchema,
    validationContext: {
      creating: !worldId,
    },
    defaultValues,
  });

  const values = watch();

  const [{ error, loading: isSaving }, submit] = useAsyncFn(
    async (input: WorldGeneralFormInput) => {
      if (!values || !user) return;

      if (worldId) {
        await updateWorldStartSettings({ ...values, id: worldId }, user);
        //TODO: Change this to the most appropriate url when product decides the perfect UX
        history.push(ADMIN_V3_WORLDS_BASE_URL);
      } else {
        const { worldId: id, error } = await createWorld(values, user);

        if (id) {
          setWorldId(id);
        }

        if (error) {
          // Note, a more complex option when id exists is a redirect
          // that doesn't lose the error message for the user
          throw error;
        }

        //TODO: Change this to the most appropriate url when product decides the perfect UX
        history.push(ADMIN_V3_WORLDS_BASE_URL);
      }

      reset(input);
    },
    [worldId, user, values, reset, history]
  );

  const saveButtonProps: ButtonProps = useMemo(
    () => ({
      type: "submit",
      disabled: !dirty && !isSaving && !isSubmitting,
      loading: isSubmitting || isSaving,
    }),
    [dirty, isSaving, isSubmitting]
  );

  const dispatch = useDispatch();
  const handleChange = useCallback(
    // if form onChange called -> ignore first arg
    // if image onChange called -> use second arg
    (_, { nameUrl, valueUrl } = {}) =>
      dispatch<WorldEditActions>(
        worldEdit({
          ...omit(values, UNWANTED_FIELDS),
          [nameUrl]: valueUrl,
          worldId,
        } as WithOptionalWorldId<WorldGeneralFormInput>)
      ),
    [values, worldId, dispatch]
  );

  // NOTE: palette cleanser when starting new world, run only once on init
  useEffect(() => void dispatch<WorldEditActions>(worldEdit()), [dispatch]);

  return (
    <div className="WorldGeneralForm">
      <Form onSubmit={handleSubmit(submit)} onChange={handleChange}>
        <AdminSection title="Name your world" withLabel>
          <AdminInput
            name="name"
            subtext="If you are hosting an event, use the event name."
            placeholder="World or Event Name"
            register={register}
            errors={errors}
            max={COMMON_NAME_MAX_CHAR_COUNT}
          />
        </AdminSection>
        <AdminSection
          title={
            <>
              Upload Highlight image &nbsp;
              <span className="mod--subdued">(optional)</span>
            </>
          }
          subtitle="A plain 1920 x 1080px image works best."
          withLabel
        >
          <ImageInput
            name="bannerImage"
            imgUrl={values.bannerImageUrl}
            error={errors.bannerImageFile || errors.bannerImageUrl}
            isInputHidden={!values.bannerImageUrl}
            register={register}
            setValue={setValue}
            onChange={handleChange}
          />
        </AdminSection>
        <AdminSection
          title={
            <>
              Upload your logo &nbsp;
              <span className="mod--subdued">(optional)</span>
            </>
          }
          subtitle="A 400 px square image works best."
          withLabel
        >
          <ImageInput
            name="logoImage"
            imgUrl={values?.logoImageUrl}
            error={errors.logoImageFile || errors.logoImageUrl}
            setValue={setValue}
            register={register}
            small
            onChange={handleChange}
          />
        </AdminSection>
        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={error} />

        <div className="AdminSidebar__buttons">
          <ButtonNG
            className="AdminSidebar__button AdminSidebar__button--larger"
            variant="primary"
            {...saveButtonProps}
          >
            Save
          </ButtonNG>
        </div>
      </Form>
    </div>
  );
};
