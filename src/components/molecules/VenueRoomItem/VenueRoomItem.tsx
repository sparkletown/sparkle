import { createRoom, createVenue_v2, VenueInput_v2 } from "api/admin";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import {
  venueRoomSchema,
  roomSchema,
} from "pages/Admin/Details/ValidationSchema";
import React, { useCallback, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { DEFAULT_VENUE_LOGO } from "settings";
import { VenueTemplate } from "types/venues";
import { venueInsideUrl } from "utils/url";

interface VenueRoomItemProps {
  icon: string;
  text: string;
  template?: VenueTemplate;
}

export const VenueRoomItem: React.FC<VenueRoomItemProps> = ({
  icon,
  text,
  template,
}) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  // const [isDeleting, setDeleting] = useState<boolean>(false)
  // const [error, setError] = useState<string>("")

  const { user } = useUser();

  const venueId = useVenueId();

  const { register, watch, handleSubmit, errors } = useForm({
    validationSchema: template ? venueRoomSchema : roomSchema,
    defaultValues: {
      roomTitle: "",
      roomUrl: "",
      venueName: "",
      template: template,
    },
  });

  const values = watch();

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const onSubmit = useCallback(async () => {
    if (!user || !venueId) return;

    const roomUrl = template
      ? window.origin + venueInsideUrl(values.venueName)
      : values.roomUrl;
    const roomData = {
      title: values.roomTitle,
      isEnabled: true,
      image_url: DEFAULT_VENUE_LOGO,
      url: roomUrl,
      template,
    };

    try {
      if (template) {
        const list = new DataTransfer();

        const fileList = list.files;

        const venueInput: VenueInput_v2 = {
          name: values.venueName,
          subtitle: "",
          description: "",
          template: template,
          bannerImageFile: fileList,
          bannerImageUrl: "",
          logoImageUrl: "",
          mapBackgroundImageUrl: "",
          logoImageFile: fileList,
          rooms: [],
        };

        await createVenue_v2(venueInput, user);
      }
      await createRoom(roomData, venueId, user);
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  }, [
    template,
    user,
    values.roomTitle,
    values.roomUrl,
    values.venueName,
    venueId,
  ]);

  return (
    <>
      <Modal show={isModalVisible} onHide={closeModal}>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <div className="room-edit-modal__input">
                <Form.Label>Room title</Form.Label>
                <Form.Control
                  type="text"
                  ref={register}
                  name="roomTitle"
                  placeholder="Room title"
                  custom
                />
                {errors.roomTitle && (
                  <span className="input-error">
                    {errors.roomTitle.message}
                  </span>
                )}
              </div>
            </Form.Row>

            {template && (
              <Form.Row>
                <div className="room-edit-modal__input">
                  <Form.Label>Venue name</Form.Label>
                  <Form.Control
                    type="text"
                    ref={register}
                    name="venueName"
                    placeholder="Venue name"
                    custom
                  />
                  {errors.venueName && (
                    <span className="input-error">
                      {errors.venueName.message}
                    </span>
                  )}
                </div>
              </Form.Row>
            )}

            {!template && (
              <Form.Row>
                <div className="room-edit-modal__input">
                  <Form.Label>Room url</Form.Label>
                  <Form.Control
                    type="text"
                    ref={register}
                    name="roomUrl"
                    placeholder="Room url"
                    custom
                  />
                  {errors.roomUrl && (
                    <span className="input-error">
                      {errors.roomUrl.message}
                    </span>
                  )}
                </div>
              </Form.Row>
            )}

            <Button title="Add room" type="submit">
              Add room
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="spaces__venue-room" onClick={() => setModalVisible(true)}>
        <div
          className="spaces__room-external-link"
          style={{ backgroundImage: `url(${icon})` }}
        />
        <div>{text}</div>
      </div>
    </>
  );
};
