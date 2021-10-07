import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { ROOM_TAXON } from "settings";

import {
  createRoom,
  createUrlSafeName,
  createVenue_v2,
  RoomInput_v2,
} from "api/admin";

import { VenueTemplate } from "types/venues";

import { venueInsideUrl } from "utils/url";
import { buildEmptyVenue } from "utils/venue";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { venueRoomSchema } from "pages/Admin/Details/ValidationSchema";

import { AdminSidebarSectionSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionSubTitle";

import { InputField } from "components/atoms/InputField";

import "./VenueRoomModal.scss";

export interface VenueRoomModalProps {
  icon: string;
  template?: VenueTemplate;
  worldId: string;
  isModalVisible: boolean;
  hideModal: () => void;
}

export const VenueRoomModal: React.FC<VenueRoomModalProps> = ({
  icon,
  template,
  worldId,
  isModalVisible,
  hideModal,
}) => {
  const { user } = useUser();

  const venueId = useVenueId();

  const { register, getValues, handleSubmit, watch, errors } = useForm({
    validationSchema: venueRoomSchema,
    defaultValues: {
      roomTitle: "",
      roomUrl: "",
      venueName: "",
      template: template,
    },
  });
  const values = watch();

  const [{ loading: isLoading }, addRoom] = useAsyncFn(async () => {
    if (!user || !venueId || !template) return;

    const roomValues = getValues();

    const venueUrlName = createUrlSafeName(roomValues.venueName);

    const roomUrl = window.origin + venueInsideUrl(venueUrlName);

    const roomData: RoomInput_v2 = {
      title: roomValues.roomTitle,
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

  console.log(errors);

  return (
    <Modal show={isModalVisible} onHide={hideModal}>
      <Modal.Body>
        {template === VenueTemplate.auditorium ? (
          <Form onSubmit={handleSubmit(addRoom)}>
            <Form.Label>Space name</Form.Label>
            <InputField
              name="venueName"
              type="text"
              autoComplete="off"
              placeholder="Space name"
              error={errors.venueName}
              ref={register()}
              disabled={isLoading}
            />
            <AdminSidebarSectionSubTitle>
              The url of your space is{" "}
              <span>{createUrlSafeName(values.venueName)}</span>
            </AdminSidebarSectionSubTitle>

            <Button
              disabled={isLoading}
              title={`Add ${ROOM_TAXON.lower}`}
              type="submit"
            >
              Add {ROOM_TAXON.lower}
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleSubmit(addRoom)}>
            <Form.Label>{ROOM_TAXON.capital} title</Form.Label>
            <InputField
              name="roomTitle"
              type="text"
              autoComplete="off"
              placeholder={`${ROOM_TAXON.capital} title`}
              error={errors.roomTitle}
              ref={register()}
              disabled={isLoading}
            />

            <>
              <Form.Label>Venue name</Form.Label>
              <InputField
                name="venueName"
                type="text"
                autoComplete="off"
                placeholder="Venue name"
                error={errors.venueName}
                ref={register()}
                disabled={isLoading}
              />
            </>

            <Button
              disabled={isLoading}
              title={`Add ${ROOM_TAXON.lower}`}
              type="submit"
            >
              Add {ROOM_TAXON.lower}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};
