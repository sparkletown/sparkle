import ImageInput from "components/atoms/ImageInput";
import firebase from "firebase/app";
import { useVenueId } from "hooks/useVenueId";
import { roomEditSchema } from "pages/Admin/Details/ValidationSchema";
import React, { useCallback, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { RoomData_v2 } from "types/rooms";

import "./AddRoom.scss";

interface AddRoomProps {
  room: RoomData_v2;
  onBackPress: () => void;
  onDelete?: () => void;
}
export const AddRoom: React.FC<AddRoomProps> = ({
  room,
  onBackPress,
  onDelete,
}) => {
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const venueId = useVenueId();

  const { register, handleSubmit, setValue, errors } = useForm({
    validationSchema: roomEditSchema,
    defaultValues: {
      title: room.title,
      url: room.url,
      description: room.description,
      template: room.template,
      image_url: room.image_url,
    },
  });

  const handleImageChange = useCallback(
    (val: string) => {
      setValue("image_url", val, false);
    },
    [setValue]
  );

  const onSubmit = useCallback(() => {}, []);

  const deleteRoom = useCallback(async () => {
    setDeleting(true);
    try {
      await firebase.functions().httpsCallable("venue-deleteRoom")({
        venueId,
        room,
      });
      onDelete && onDelete();
    } catch (error) {
      setError("Can't delete room, please try again.");
    } finally {
      setDeleting(false);
    }
  }, [venueId, room, onDelete]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="edit-space">
        <div className="edit-space__room">
          {/* <div className="edit-space__room-type">Room type:</div> */}
          {/* <div>{room.type}</div>
        <div>{room.template}</div> */}

          <Form.Row>
            <div className="room-edit-modal__input">
              <Form.Label>Room name</Form.Label>
              <Form.Control
                type="text"
                ref={register}
                name="title"
                placeholder="Room name"
                custom
              />
              {errors.title && (
                <span className="input-error">{errors.title.message}</span>
              )}
            </div>
          </Form.Row>

          <Form.Row>
            <div className="room-edit-modal__input">
              <Form.Label>Room tagline</Form.Label>
              <Form.Control
                type="text"
                ref={register}
                name="description"
                placeholder="Description"
                custom
              />
              {errors.description && (
                <span className="input-error">
                  {errors.description.message}
                </span>
              )}
            </div>
          </Form.Row>

          <div>Room enabled:</div>
          <div>{!!room.isEnabled}</div>

          <Form.Row>
            <div className="room-edit-modal__input">
              <Form.Label>Room url</Form.Label>
              <Form.Control
                type="text"
                ref={register}
                name="url"
                placeholder="Room url"
                custom
              />
              {errors.url && (
                <span className="input-error">{errors.url.message}</span>
              )}
            </div>
          </Form.Row>

          <Form.Row>
            <div className="room-edit-modal__input">
              <Form.Label>Room image:</Form.Label>
              <ImageInput
                onChange={handleImageChange}
                name="image"
                forwardRef={register}
                small
                nameWithUnderscore
                imgUrl={room.image_url}
              />
              {errors.image_url && (
                <span className="input-error">{errors.image_url.message}</span>
              )}
            </div>
          </Form.Row>

          <Button onClick={deleteRoom}>Delete room</Button>
          {error && <div>Error: {error}</div>}
        </div>

        <div className="edit-space__footer">
          <Button onClick={onBackPress}>Back</Button>
          <Button
            className="confirm-button"
            type="submit"
            disabled={isDeleting}
          >
            Save changes
          </Button>
        </div>
      </div>
    </Form>
  );
};
