import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { DEFAULT_VENUE_LOGO } from "settings";

import { createRoom, createVenue_v2, RoomInput_v2 } from "api/admin";

import { RoomTemplate, VenueRoomTemplate } from "types/rooms";

import { venueInsideUrl } from "utils/url";
import { buildEmptyVenue } from "utils/venue";

import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import {
  roomSchema,
  venueRoomSchema,
} from "pages/Admin/Details/ValidationSchema";

import { InputField } from "components/atoms/InputField";

import "./VenueRoomItem.scss";

export interface VenueRoomItemProps {
  icon: string;
  text: string;
  template?: VenueRoomTemplate;
  worldId: string;
}

export const VenueRoomItem: React.FC<VenueRoomItemProps> = ({
  icon,
  text,
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

  const isVenuePortal = template !== RoomTemplate.external;

  const { register, getValues, handleSubmit, errors } = useForm({
    validationSchema: isVenuePortal ? venueRoomSchema : roomSchema,
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

    const roomUrl = isVenuePortal
      ? window.origin + venueInsideUrl(roomValues.venueName)
      : roomValues.roomUrl;

    const roomData: RoomInput_v2 = {
      title: roomValues.roomTitle,
      isEnabled: true,
      image_url: DEFAULT_VENUE_LOGO,
      url: roomUrl,
      template,
    };

    // TS doesn't work properly with const statements and won't 'know' that this is already checked.
    // That's why this is inline instead of isVenuePortal
    if (template !== RoomTemplate.external) {
      const venueData = {
        ...buildEmptyVenue(roomValues.venueName, template),
        parentId: venueId,
      };

      await createVenue_v2({ ...venueData, worldId }, user);
    }

    await createRoom(roomData, venueId, user).then(() => hideModal());
  }, [getValues, hideModal, isVenuePortal, template, user, venueId, worldId]);

  return (
    <>
      <Modal show={isModalVisible} onHide={hideModal}>
        <Modal.Body>
          <Form onSubmit={handleSubmit(addRoom)}>
            <Form.Label>Room title</Form.Label>
            <InputField
              name="roomTitle"
              type="text"
              autoComplete="off"
              placeholder="Room title"
              error={errors.roomTitle}
              ref={register()}
              disabled={isLoading}
            />

            {isVenuePortal && (
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
            )}

            {!isVenuePortal && (
              <>
                <Form.Label>Room url</Form.Label>
                <InputField
                  name="roomUrl"
                  type="text"
                  autoComplete="off"
                  placeholder="Room url"
                  error={errors.roomUrl}
                  ref={register()}
                  disabled={isLoading}
                />
              </>
            )}

            <Button disabled={isLoading} title="Add room" type="submit">
              Add room
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="VenueRoomItem" onClick={showModal}>
        <img
          alt={`room-icon-${icon}`}
          src={icon}
          className="VenueRoomItem__room-icon"
        />
        <div>{text}</div>
      </div>
    </>
  );
};
