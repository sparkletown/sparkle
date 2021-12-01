import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { PortalInfoListItem, SPACE_INFO_LIST, SPACE_TAXON } from "settings";

import { createVenue_v2 } from "api/admin";

import { spaceCreatePortalItem } from "store/actions/SpaceEdit";

import { buildEmptySpace } from "utils/venue";

import { createPortalSchema } from "forms/createPortalSchema";
import { createSpaceSchema } from "forms/createSpaceSchema";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useDispatch } from "hooks/useDispatch";
import { useUser } from "hooks/useUser";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminInput } from "components/molecules/AdminInput";
import { PortalList } from "components/molecules/PortalList";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./SpaceCreateForm.scss";

export interface SpaceCreateFormProps {
  worldId?: string;
  onDone?: () => void;
}

export const SpaceCreateForm: React.FC<SpaceCreateFormProps> = ({ onDone }) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { spaceSlug } = useSpaceParams();
  const { worldId } = useWorldBySlug(spaceSlug);
  const [selectedItem, setSelectedItem] = useState<
    PortalInfoListItem | undefined
  >();
  const { icon: logoImageUrl, template } = selectedItem ?? {};

  const { register, getValues, handleSubmit, errors } = useForm({
    validationSchema:
      template === "external" ? createPortalSchema : createSpaceSchema,
    defaultValues: {
      roomTitle: "",
      roomUrl: "",
      venueName: "",
      template,
    },
  });

  const [
    { loading: isLoading, error: submitError },
    addPortal,
  ] = useAsyncFn(async () => {
    const { venueName, template } = getValues();
    if (!user || !spaceSlug || !template || !worldId) return;

    if (template !== "external") {
      await createVenue_v2(
        {
          ...buildEmptySpace(venueName, template),
          worldId,
          logoImageUrl,
        },
        user
      );
    }

    await onDone?.();
  }, [getValues, worldId, onDone, logoImageUrl, user, spaceSlug]);

  const handlePortalClick = useCallback(
    ({ item }) => {
      setSelectedItem(item);
      dispatch(spaceCreatePortalItem(item));
    },
    [dispatch]
  );

  // NOTE: palette cleanser when starting new world, run only once on init
  useEffect(() => void dispatch(spaceCreatePortalItem()), [dispatch]);

  return (
    <Form className="SpaceCreateForm" onSubmit={handleSubmit(addPortal)}>
      <AdminInput
        name="name"
        type="text"
        autoComplete="off"
        placeholder={`${SPACE_TAXON.capital} name`}
        errors={errors}
        register={register}
        disabled={isLoading}
      />
      <PortalList
        items={SPACE_INFO_LIST}
        selectedItem={selectedItem}
        variant="input"
        onClick={handlePortalClick}
        name="template"
      />
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
    </Form>
  );
};
