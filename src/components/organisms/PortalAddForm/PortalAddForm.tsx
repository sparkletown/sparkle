import React from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import {
  DEFAULT_PORTAL_INPUT,
  PortalInfoListItem,
  ROOM_TAXON,
  SPACE_TAXON,
} from "settings";

import { createRoom, createSlug, createVenue_v2 } from "api/admin";

import { PortalInput } from "types/rooms";

import { venueInsideFullUrl } from "utils/url";
import { buildEmptySpace } from "utils/venue";

import { createPortalSchema } from "forms/createPortalSchema";
import { createSpaceSchema } from "forms/createSpaceSchema";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useCheckImage } from "hooks/useCheckImage";
import { useUser } from "hooks/useUser";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminInput } from "components/molecules/AdminInput";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./PortalAddForm.scss";

export interface PortalAddFormProps {
  item: PortalInfoListItem;
  onDone: () => void;
}

export const PortalAddForm: React.FC<PortalAddFormProps> = ({
  item,
  onDone,
}) => {
  const { description, icon, poster, template, text } = item;

  const { user } = useUser();
  const { spaceSlug, worldSlug } = useSpaceParams();
  const { worldId } = useWorldBySlug(worldSlug);
  const { spaceId } = useSpaceBySlug(spaceSlug);

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
    if (!user || !spaceSlug || !template || !worldId || !spaceId) return;

    const { roomUrl, venueName } = getValues();

    const slug = createSlug(venueName);
    const url = template === "external" ? roomUrl : venueInsideFullUrl(slug);

    const portalData: PortalInput = {
      ...DEFAULT_PORTAL_INPUT,
      title: venueName,
      image_url: icon,
      url,
      template,
    };

    if (template !== "external") {
      const venueData = buildEmptySpace(venueName, template);
      const newSpaceSlug = createSlug(venueName);

      await createVenue_v2(
        {
          ...venueData,
          worldId,
          parentId: spaceSlug, // @debt this should be parent's spaceId, and if needed unambiguous identifiers, uncomment the following
          // parentSpaceId: spaceId,
          // parentSpaceSlug: spaceSlug,
          logoImageUrl: icon,
          name: newSpaceSlug, // @debt this should be unfiltered venueName once the possible bugs of mixing slug with id are resolved
          slug: newSpaceSlug,
        },
        user
      );
    }

    // @debt this is wrong, for all intents and purposes the venueId a.k.a spaceId is the identifier of the parent space
    await createRoom(portalData, spaceId, user);
    await onDone();
  }, [getValues, worldId, onDone, icon, template, user, spaceSlug, spaceId]);

  const { isValid: isPosterValid } = useCheckImage(poster);

  return (
    <Form className="PortalAddForm__form" onSubmit={handleSubmit(addPortal)}>
      <div className="PortalAddForm__title">{text}</div>
      {isPosterValid && (
        <img
          className="PortalAddForm__poster"
          alt={`${text} representation`}
          src={poster}
        />
      )}
      <div className="PortalAddForm__description">{description}</div>
      <AdminInput
        name="venueName"
        type="text"
        autoComplete="off"
        placeholder={`${SPACE_TAXON.capital} name`}
        errors={errors}
        register={register}
        disabled={isLoading}
      />
      {template === "external" && (
        <AdminInput
          name="roomUrl"
          type="text"
          autoComplete="off"
          placeholder={`${SPACE_TAXON.capital} url`}
          errors={errors}
          register={register}
          disabled={isLoading}
        />
      )}
      <SubmitError error={submitError} />
      <div className="PortalAddForm__buttons">
        <ButtonNG
          variant="primary"
          disabled={isLoading}
          title={`Add ${ROOM_TAXON.lower}`}
          type="submit"
        >
          Add {ROOM_TAXON.lower}
        </ButtonNG>
      </div>
    </Form>
  );
};
