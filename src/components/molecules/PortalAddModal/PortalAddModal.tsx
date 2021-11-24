import React from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import {
  DEFAULT_PORTAL_INPUT,
  ROOM_TAXON,
  SPACE_TAXON,
  SpacePortalsListItem,
} from "settings";

import { createRoom, createSlug, createVenue_v2 } from "api/admin";

import { PortalInput } from "types/rooms";

import { venueInsideFullUrl } from "utils/url";
import { buildEmptyVenue } from "utils/venue";

import { createPortalSchema } from "forms/createPortalSchema";
import { createSpaceSchema } from "forms/createSpaceSchema";

import { useCheckImage } from "hooks/useCheckImage";
import { useSpaceParams } from "hooks/useSpaceParams";
import { useUser } from "hooks/useUser";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { AdminInput } from "components/molecules/AdminInput";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./PortalAddModal.scss";

export type PortalAddModalProps = {
  item: SpacePortalsListItem;
  show: boolean;
  onHide: () => void;
};

export const PortalAddModal: React.FC<PortalAddModalProps> = ({
  item,
  onHide,
  show,
}) => {
  const { description, icon, poster, template, text } = item;

  const { user } = useUser();
  const spaceSlug = useSpaceParams();
  const { worldId } = useWorldBySlug(spaceSlug);

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
    if (!user || !spaceSlug || !template || !worldId) return;

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
      const venueData = buildEmptyVenue(venueName, template);
      const newSpaceSlug = createSlug(venueName);

      await createVenue_v2(
        {
          ...venueData,
          worldId,
          parentId: spaceSlug, // @debt this should be parent's spaceId and if needed parentSlug: spaceSlug should be added
          logoImageUrl: icon,
          name: newSpaceSlug, // @debt this should be unfiltered venueName once the possible bugs of mixing slug with id are resolved
          slug: newSpaceSlug,
        },
        user
      );
    }

    // @debt this is wrong, for all intents and purposes the venueId a.k.a spaceId is the identifier of the parent space
    await createRoom(portalData, spaceSlug, user);
    await onHide();
  }, [getValues, worldId, onHide, icon, template, user, spaceSlug]);

  const { isValid: isPosterValid } = useCheckImage(poster);

  return (
    <Modal className="PortalAddModal" show={show} onHide={onHide} centered>
      <Modal.Body>
        <Form
          className="PortalAddModal__form"
          onSubmit={handleSubmit(addPortal)}
        >
          <div className="PortalAddModal__title">{text}</div>
          {isPosterValid && (
            <img
              className="PortalAddModal__poster"
              alt={`${text} representation`}
              src={poster}
            />
          )}
          <div className="PortalAddModal__description">{description}</div>
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
          <div className="PortalAddModal__buttons">
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
      </Modal.Body>
    </Modal>
  );
};
