import Bugsnag from "@bugsnag/js";
import { RoomInput, upsertRoom } from "api/admin";
import ImageInput from "components/atoms/ImageInput";
import firebase from "firebase/app";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { roomEditSchema } from "pages/Admin/Details/ValidationSchema";
import React, { useCallback, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { RoomData_v2 } from "types/rooms";

import "./EditSpace.scss";

interface EditSpaceProps {
  room: RoomData_v2;
  updatedRoom: RoomData_v2;
  roomIndex: number;
  onBackPress: (roomIndex: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}
export const EditSpace: React.FC<EditSpaceProps> = ({
  room,
  updatedRoom,
  roomIndex,
  onBackPress,
  onDelete,
  onEdit,
}) => {
  const [error, setError] = useState<string>("");

  const { user } = useUser();

  const venueId = useVenueId();

  console.log("room", room);

  const { register, handleSubmit, setValue, watch, errors } = useForm({
    reValidateMode: "onChange",
    validationSchema: roomEditSchema,
    defaultValues: {
      title: room.title,
      url: room.url,
      isEnabled: room.isEnabled,
      description: room.description,
      template: room.template,
      image_url: room.image_url,
    },
  });

  const values = watch();

  const handleImageChange = useCallback(
    (val: string) => {
      setValue("image_url", val, false);
    },
    [setValue]
  );

  const [{ loading: isUpdating }, updateRoom] = useAsyncFn(async () => {
    if (!user || !venueId) return;
    try {
      const roomData = {
        ...(room as RoomInput),
        ...(updatedRoom as RoomInput),
        ...values,
      };
      console.log("roomData", roomData);
      await upsertRoom(roomData, venueId, user, roomIndex);
      onEdit && onEdit();
    } catch (e) {
      console.log(error, e);

      Bugsnag.notify(e, (event) => {
        event.addMetadata("AdminEditSpace::updateRoom", {
          venueId: venueId,
          roomIndex,
        });
      });
    }
  }, [error, onEdit, room, roomIndex, updatedRoom, user, values, venueId]);

  const [{ loading: isDeleting }, deleteRoom] = useAsyncFn(async () => {
    try {
      await firebase.functions().httpsCallable("venue-deleteRoom")({
        venueId,
        room,
      });
      onDelete && onDelete();
    } catch (error) {
      setError("Can't delete room, please try again.");
    }
  }, [venueId, room, onDelete]);

  const changeRoomState = () => {
    setValue("isEnabled", !values.isEnabled);
  };

  return (
    <Form onSubmit={handleSubmit(updateRoom)}>
      <div className="edit-space">
        <div className="edit-space__room">
          <Form.Row>
            <div className="room-edit-modal__input">
              <Form.Label>Room type</Form.Label>
              <Form.Control
                type="text"
                ref={register}
                name="template"
                value={room.template}
                placeholder="Room name"
                custom
                disabled={true}
              />
            </div>
          </Form.Row>

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

          <Form.Row>
            <Form.Label>Room enabled</Form.Label>
            <label id={"isEnabled"} className="switch">
              <input
                type="checkbox"
                id={"isEnabled"}
                name={"isEnabled"}
                checked={values.isEnabled}
                onChange={changeRoomState}
                ref={register}
              />
              <span className="slider round"></span>
            </label>
          </Form.Row>

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

          <Button disabled={isUpdating || isDeleting} onClick={deleteRoom}>
            Delete room
          </Button>
          {error && <div>Error: {error}</div>}
        </div>

        <div className="edit-space__footer">
          <Button onClick={() => onBackPress(roomIndex)}>Back</Button>
          <Button
            className="confirm-button"
            type="submit"
            disabled={isUpdating || isDeleting}
          >
            Save changes
          </Button>
        </div>
      </div>
    </Form>
  );
};
