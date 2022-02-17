import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";

import {
  ADMIN_IA_SPACE_BASE_PARAM_URL,
  ADMIN_IA_WORLD_PARAM_URL,
  PortalInfoItem,
  SPACE_INFO_LIST,
  SPACE_TAXON,
} from "settings";

import { createSlug, createVenue_v2 } from "api/admin";

import { spaceCreatePortalItem } from "store/actions/SpaceEdit";

import { SpaceSlug } from "types/id";

import { adminNGVenueUrl, generateUrl } from "utils/url";
import { buildEmptySpace } from "utils/venue";

import { createSpaceSchema } from "forms/createSpaceSchema";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useDispatch } from "hooks/useDispatch";
import { useUser } from "hooks/useUser";

import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { FormCover } from "components/molecules/FormCover";
import { FormErrors } from "components/molecules/FormErrors";
import { PortalList } from "components/molecules/PortalList";
import { SubmitError } from "components/molecules/SubmitError";
import { YourUrlDisplay } from "components/molecules/YourUrlDisplay";

import { ButtonNG } from "components/atoms/ButtonNG";

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = ["venueName", "template"];

export interface SpaceCreateFormProps {
  worldId?: string;
}

export const SpaceCreateForm: React.FC<SpaceCreateFormProps> = ({
  worldId,
}) => {
  const { worldSlug } = useSpaceParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useUser();
  const [selectedItem, setSelectedItem] = useState<
    PortalInfoItem | undefined
  >();
  const { icon: logoImageUrl, template } = selectedItem ?? {};

  const { register, getValues, handleSubmit, errors, reset, watch } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    validationSchema: createSpaceSchema,
    defaultValues: {
      venueName: "",
      template,
    },
  });

  const { venueName } = getValues();

  const [
    { loading: isLoading, error: submitError },
    createSpace,
  ] = useAsyncFn(async () => {
    if (!worldId || !user || !template || template === "external") return;

    const data = {
      ...buildEmptySpace(venueName, template),
      worldId,
      logoImageUrl,
    };

    await createVenue_v2(data, user);

    history.push(adminNGVenueUrl(worldSlug, data.slug as SpaceSlug));
  }, [worldId, logoImageUrl, user, template, venueName, worldSlug, history]);

  const { venueName: watchedName } = watch();
  const slug = useMemo(() => createSlug(watchedName), [watchedName]);

  const navigateToSpaces = () => {
    history.push(
      generateUrl({
        route: ADMIN_IA_WORLD_PARAM_URL,
        required: ["worldSlug"],
        params: { worldSlug },
      })
    );
  };

  const handlePortalClick = useCallback(
    ({ item }) => {
      setSelectedItem(item);
      dispatch(spaceCreatePortalItem(item));
    },
    [dispatch]
  );

  useEffect(() => {
    const { template: inputTemplate, venueName } = getValues();
    reset({ venueName, template: template ?? inputTemplate });
  }, [template, getValues, reset]);

  // NOTE: palette cleanser when creating new space, run only once on init
  useEffect(() => void dispatch(spaceCreatePortalItem()), [dispatch]);

  const isSaveDisabled = isLoading || !slug || !template;

  const saveButtonClasses =
    "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sparkle text-base font-medium text-white disabled:bg-gray-200 disabled:text-gray-50 disabled:shadow-none disabled:cursor-not-allowed hover:bg-sparkle-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm";
  const cancelButtonClasses =
    "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm";
  const footerClasses = "mt-5 sm:mt-4 sm:flex sm:flex-row-reverse";

  return (
    <form className="SpaceCreateForm" onSubmit={handleSubmit(createSpace)}>
      <FormCover displayed={isLoading}>
        <AdminSection
          withLabel
          title={`${SPACE_TAXON.capital} name`}
          subtitle="max 50 characters"
        >
          <AdminInput
            name="venueName"
            type="text"
            autoComplete="off"
            value={venueName}
            placeholder={`${SPACE_TAXON.capital} name`}
            errors={errors}
            register={register}
            disabled={isLoading}
          />
        </AdminSection>
        <AdminSection title="Your URL will be">
          <YourUrlDisplay
            path={generateUrl({
              route: ADMIN_IA_SPACE_BASE_PARAM_URL,
              required: ["worldSlug"],
              params: { worldSlug },
            })}
            slug={slug}
          />
        </AdminSection>
        <AdminSection withLabel title="Select a template">
          <PortalList
            name="template"
            variant="input"
            items={SPACE_INFO_LIST}
            selectedItem={selectedItem}
            onClick={handlePortalClick}
            register={register}
            errors={errors}
          />
        </AdminSection>
        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={submitError} />
        <div className={footerClasses}>
          <ButtonNG
            type="submit"
            disabled={isSaveDisabled}
            className={saveButtonClasses}
            title="Save"
          >
            Save
          </ButtonNG>
          <ButtonNG
            onClick={navigateToSpaces}
            className={cancelButtonClasses}
            title="Cancel"
            variant="white"
          >
            Cancel
          </ButtonNG>
        </div>
      </FormCover>
    </form>
  );
};
