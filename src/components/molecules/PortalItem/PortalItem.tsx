import React from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { ROOM_TAXON, SPACE_TAXON } from "settings";

import {
  createRoom,
  createUrlSafeName,
  createVenue_v2,
  RoomInput_v2,
} from "api/admin";

import { VenueTemplate } from "types/venues";

import { venueInsideUrl } from "utils/url";
import { buildEmptyVenue } from "utils/venue";

import { useCheckImage } from "hooks/useCheckImage";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { createSpaceSchema } from "pages/Admin/Details/ValidationSchema";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";

import "./PortalItem.scss";

export interface PortalItemProps {
  icon: string;
  text: string;
  poster: string;
  description: string;
  template?: VenueTemplate;
  worldId: string;
}

export const PortalItem: React.FC<PortalItemProps> = ({
  icon,
  text,
  poster,
  description,
  template,
  worldId,
}) => {
  const {
    isShown: isModalVisible,
    show: showModal,
    hide: hideModal,
  } = useShowHide();

  const { user } = useUser();

  const venueId = useVenueId();

  const { register, getValues, handleSubmit, errors } = useForm({
    validationSchema: createSpaceSchema,
    defaultValues: {
      roomTitle: "",
      roomUrl: "",
      venueName: "",
      template: template,
    },
  });

  const [{ loading: isLoading }, addRoom] = useAsyncFn(async () => {
    if (!user || !venueId || !template) return;

    const roomValues = getValues();

    const venueUrlName = createUrlSafeName(roomValues.venueName);

    const roomUrl = window.origin + venueInsideUrl(venueUrlName);

    const roomData: RoomInput_v2 = {
      title: roomValues.venueName,
      about: "",
      isEnabled: true,
      image_url: icon,
      url: roomUrl,
      width_percent: 5,
      height_percent: 5,
      x_percent: 50,
      y_percent: 50,
      template,
    };

    const venueData = buildEmptyVenue(roomValues.venueName, template);

    await createVenue_v2({ ...venueData, worldId, parentId: venueId }, user);
    await createRoom(roomData, venueId, user).then(() => hideModal());
  }, [getValues, hideModal, icon, template, user, venueId, worldId]);

  const { isValid } = useCheckImage(poster);

  return (
    <>
      <Modal show={isModalVisible} onHide={hideModal}>
        <Modal.Body>
          <Form onSubmit={handleSubmit(addRoom)}>
            <div className="PortalItem__title">{text}</div>
            {isValid && (
              <img className="PortalItem__poster" alt={text} src={poster} />
            )}
            <div className="PortalItem__description">{description}</div>
            <InputField
              name="venueName"
              type="text"
              autoComplete="off"
              placeholder={`${SPACE_TAXON.capital} name`}
              error={errors.venueName}
              ref={register()}
              disabled={isLoading}
            />

            <div className="PortalItem__center-content">
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
      <div className="PortalItem" onClick={showModal}>
        <img
          alt={`${ROOM_TAXON.lower} icon ${icon}`}
          src={icon}
          className="PortalItem__room-icon"
        />
        <div>{text}</div>
      </div>
    </>
  );
};
