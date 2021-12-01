import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { PortalInfoListItem, SPACE_INFO_LIST, SPACE_TAXON } from "settings";

import { createSlug, createVenue_v2 } from "api/admin";

import { spaceCreatePortalItem } from "store/actions/SpaceEdit";

import { adminNGVenueUrl, generateAdminIaSpacePath } from "utils/url";
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

import "./SpaceCreateForm.scss";

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
    PortalInfoListItem | undefined
  >();
  const { icon: logoImageUrl, template } = selectedItem ?? {};

  const { register, getValues, handleSubmit, errors, reset, watch } = useForm({
    validationSchema: createSpaceSchema,
    defaultValues: {
      venueName: "",
      template,
    },
  });

  const [
    { loading: isLoading, error: submitError },
    addPortal,
  ] = useAsyncFn(async () => {
    const values = getValues();
    const template = selectedItem?.template ?? values?.template;

    if (!worldId || !user || !template || template === "external") return;

    const data = {
      ...buildEmptySpace(values.venueName, template),
      worldId,
      logoImageUrl,
    };

    await createVenue_v2(data, user);
    history.push(adminNGVenueUrl(worldSlug, data.slug));
  }, [
    getValues,
    worldId,
    logoImageUrl,
    user,
    selectedItem,
    worldSlug,
    history,
  ]);

  const slug = useMemo(() => {
    const values = watch();
    return createSlug(values.venueName);
  }, [watch]);

  const handlePortalClick = useCallback(
    ({ item }) => {
      setSelectedItem(item);
      dispatch(spaceCreatePortalItem(item));
    },
    [dispatch]
  );

  useEffect(() => {
    const values = getValues();
    reset({
      venueName: values.venueName,
      template: selectedItem?.template ?? values.template,
    });
  }, [selectedItem, getValues, reset]);

  // NOTE: palette cleanser when creating new space, run only once on init
  useEffect(() => void dispatch(spaceCreatePortalItem()), [dispatch]);

  return (
    <Form className="SpaceCreateForm" onSubmit={handleSubmit(addPortal)}>
      <FormCover displayed={isLoading}>
        <AdminSection withLabel title={`${SPACE_TAXON.capital} name`}>
          <AdminInput
            name="venueName"
            type="text"
            autoComplete="off"
            placeholder={`${SPACE_TAXON.capital} name`}
            errors={errors}
            register={register}
            disabled={isLoading}
          />
        </AdminSection>
        <AdminSection title="Your URL will be">
          <YourUrlDisplay
            path={generateAdminIaSpacePath(worldSlug)}
            slug={slug}
          />
        </AdminSection>
        <AdminSection withLabel title="Pick a template">
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
        <div className="SpaceCreateForm__buttons">
          <ButtonNG
            variant="primary"
            disabled={isLoading}
            title={`Create ${SPACE_TAXON.lower}`}
            type="submit"
          >
            Create
          </ButtonNG>
        </div>
      </FormCover>
    </Form>
  );
};
