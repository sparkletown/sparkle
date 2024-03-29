import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";

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
import { useUserId } from "hooks/user/useUserId";

import { FormCover } from "components/molecules/FormCover";
import { FormErrors } from "components/molecules/FormErrors";
import { PortalList } from "components/molecules/PortalList";
import { SubmitError } from "components/molecules/SubmitError";
import { YourUrlDisplay } from "components/molecules/YourUrlDisplay";

import { Button } from "../Button";

import * as TW from "./SpaceCreateForm.tailwind";

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
  const { userId } = useUserId();
  const [selectedItem, setSelectedItem] = useState<
    PortalInfoItem | undefined
  >();
  const { icon: logoImageUrl, template } = selectedItem ?? {};

  const { register, getValues, handleSubmit, control, reset, watch } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: yupResolver(createSpaceSchema),
    defaultValues: {
      venueName: "",
      template,
    },
  });

  const { errors } = useFormState({ control });

  const { venueName } = getValues();

  const [
    { loading: isLoading, error: submitError },
    createSpace,
  ] = useAsyncFn(async () => {
    if (!worldId || !userId || !template || template === "external") return;

    const data = {
      ...buildEmptySpace(venueName, template),
      worldId,
      logoImageUrl,
    };

    await createVenue_v2(data, userId);

    history.push(adminNGVenueUrl(worldSlug, data.slug as SpaceSlug));
  }, [worldId, logoImageUrl, userId, template, venueName, worldSlug, history]);

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

  return (
    <form className="SpaceCreateForm" onSubmit={handleSubmit(createSpace)}>
      <FormCover displayed={isLoading}>
        <InputGroup
          withLabel
          title={`${SPACE_TAXON.capital} name`}
          subtitle="max 50 characters"
        >
          <Input
            type="text"
            autoComplete="off"
            value={venueName}
            placeholder={`${SPACE_TAXON.capital} name`}
            errors={errors}
            register={register}
            name="venueName"
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup title="Your URL will be">
          <YourUrlDisplay
            path={generateUrl({
              route: ADMIN_IA_SPACE_BASE_PARAM_URL,
              required: ["worldSlug"],
              params: { worldSlug },
            })}
            slug={slug}
          />
        </InputGroup>

        <InputGroup withLabel title="Select a template">
          <PortalList
            name="template"
            items={SPACE_INFO_LIST}
            selectedItem={selectedItem}
            onClick={handlePortalClick}
            register={register}
            errors={errors}
          />
        </InputGroup>

        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={submitError} />
        <div className={TW.footer}>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isSaveDisabled}
            className={TW.saveButton}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={navigateToSpaces}
            className={TW.cancelButton}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      </FormCover>
    </form>
  );
};
