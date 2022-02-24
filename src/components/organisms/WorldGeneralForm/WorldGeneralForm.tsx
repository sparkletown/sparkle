import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useHistory } from "react-router";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { omit } from "lodash";

import { ADMIN_IA_WORLD_BASE_URL, COMMON_NAME_MAX_CHAR_COUNT } from "settings";

import { createSlug } from "api/admin";
import { createWorld, updateWorldStartSettings, World } from "api/world";

import { worldEdit, WorldEditActions } from "store/actions/WorldEdit";

import { WorldGeneralFormInput } from "types/world";

import { WithId, WithOptionalWorldId } from "utils/id";

import { worldStartSchema } from "forms/worldStartSchema";

import { useDispatch } from "hooks/useDispatch";
import { useUser } from "hooks/useUser";

import { ButtonNG, ButtonProps } from "components/atoms/ButtonNG/ButtonNG";
import { ImageInput } from "components/atoms/ImageInput";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";
import { YourUrlDisplay } from "components/molecules/YourUrlDisplay";
import { AdminSidebarButtons } from "components/organisms/AdminVenueView/components/AdminSidebarButtons";

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
const UNWANTED_FIELDS = ["logoImageFile", "bannerImageFile", "creating"];

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
    getValues,
    setValue,
    reset,
    watch,
    register,
    control,
    handleSubmit,
  } = useForm<WorldGeneralFormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: yupResolver(worldStartSchema),
    defaultValues,
  });

  const { errors, isDirty, isSubmitting } = useFormState({ control });

  const values = watch();

  const [{ error, loading: isSaving }, submit] = useAsyncFn(
    async (input: WorldGeneralFormInput) => {
      if (!values || !user) return;

      if (worldId) {
        await updateWorldStartSettings({ ...values, id: worldId }, user);
        //TODO: Change this to the most appropriate url when product decides the perfect UX
        history.push(ADMIN_IA_WORLD_BASE_URL);
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
        history.push(ADMIN_IA_WORLD_BASE_URL);
      }

      reset(omit(input, "creating"));
    },
    [worldId, user, values, reset, history]
  );

  const saveButtonProps: ButtonProps = useMemo(
    () => ({
      type: "submit",
      disabled: !isDirty && !isSaving && !isSubmitting,
      loading: isSubmitting || isSaving,
    }),
    [isDirty, isSaving, isSubmitting]
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

  const { name: worldName } = getValues();
  const worldSlug = useMemo(() => createSlug(worldName), [worldName]);

  // NOTE: palette cleanser when starting new world, run only once on init
  useEffect(() => void dispatch<WorldEditActions>(worldEdit()), [dispatch]);

  return (
    <div className="WorldGeneralForm">
      <form onSubmit={handleSubmit(submit)} onChange={handleChange}>
        <AdminSection title="Name your world" withLabel>
          <AdminInput
            subtext="If you are hosting an event, use the event name."
            placeholder="World or Event Name"
            name="name"
            register={register}
            errors={errors}
            max={COMMON_NAME_MAX_CHAR_COUNT}
          />
        </AdminSection>
        <AdminSection title="Your URL will be">
          <YourUrlDisplay path={ADMIN_IA_WORLD_BASE_URL} slug={worldSlug} />
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
            imgUrl={values.bannerImageUrl}
            error={errors.bannerImageFile || errors.bannerImageUrl}
            isInputHidden={!values.bannerImageUrl}
            register={register}
            name="bannerImage"
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

        <AdminSidebarButtons>
          <ButtonNG
            className="AdminSidebarButtons__button--larger"
            variant="primary"
            {...saveButtonProps}
          >
            {worldId ? "Update" : "Create"}
          </ButtonNG>
        </AdminSidebarButtons>
      </form>
    </div>
  );
};
