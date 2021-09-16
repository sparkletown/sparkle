import React, { useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { deleteRoom, RoomInput, upsertRoom } from "api/admin";

import { LABEL_OPTIONS, RoomData_v2, SHOW_LABEL_OPTIONS } from "types/rooms";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { roomEditSchema } from "pages/Admin/Details/ValidationSchema";

import ImageInput from "components/atoms/ImageInput";
import { InputField } from "components/atoms/InputField";

import "./EditRoomForm.scss";

interface EditRoomFormProps {
  room: RoomData_v2;
  updatedRoom: RoomData_v2;
  roomIndex: number;
  onBackClick: (roomIndex: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const EditRoomForm: React.FC<EditRoomFormProps> = ({
  room,
  updatedRoom,
  roomIndex,
  onBackClick,
  onDelete,
  onEdit,
}) => {
  const { user } = useUser();

  const venueId = useVenueId();

  const { register, handleSubmit, setValue, watch, errors } = useForm({
    reValidateMode: "onChange",
    validationSchema: roomEditSchema,
    defaultValues: {
      title: room.title,
      url: room.url,
      description: room.description,
      template: room.template,
      image_url: room.image_url,
      isLabelHidden: room.isLabelHidden ?? undefined,
    },
  });

  const values = watch();

  const handleImageChange = useCallback(
    (val: string) => {
      setValue("image_url", val, false);
    },
    [setValue]
  );

  const [{ loading: isUpdating }, updateSelectedRoom] = useAsyncFn(async () => {
    if (!user || !venueId) return;

    const roomData: RoomInput = {
      ...(room as RoomInput),
      ...(updatedRoom as RoomInput),
      ...values,
      isLabelHidden: `${values.isLabelHidden}` === LABEL_OPTIONS.NONE,
    };

    await upsertRoom(roomData, venueId, user, roomIndex);
    onEdit && onEdit();
  }, [onEdit, room, roomIndex, updatedRoom, user, values, venueId]);

  const [
    { loading: isDeleting, error },
    deleteSelectedRoom,
  ] = useAsyncFn(async () => {
    if (!venueId) return;

    await deleteRoom(venueId, room);
    onDelete && onDelete();
  }, [venueId, room, onDelete]);

  const handleBackClick = useCallback(() => {
    onBackClick(roomIndex);
  }, [onBackClick, roomIndex]);

  const labelOptions = SHOW_LABEL_OPTIONS.map((option) => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));

  return (
    <Form onSubmit={handleSubmit(updateSelectedRoom)}>
      <div className="EditRoomForm">
        <div className="EditRoomForm__room">
          <Form.Label>Room type</Form.Label>
          <InputField
            name="template"
            type="text"
            autoComplete="off"
            placeholder="Room template"
            error={errors.template}
            ref={register()}
            disabled
          />

          <Form.Label>Room name</Form.Label>
          <InputField
            name="title"
            type="text"
            autoComplete="off"
            placeholder="Room name"
            error={errors.title}
            ref={register()}
          />

          <Form.Label>Room tagline</Form.Label>
          <InputField
            name="description"
            type="text"
            autoComplete="off"
            placeholder="Description"
            error={errors.description}
            ref={register()}
          />

          <Form.Label>Room url</Form.Label>
          <InputField
            name="url"
            type="text"
            autoComplete="off"
            placeholder="Room url"
            error={errors.url}
            ref={register()}
          />

          <Form.Label>Room image:</Form.Label>
          <ImageInput
            onChange={handleImageChange}
            name="image"
            setValue={setValue}
            register={register}
            small
            nameWithUnderscore
            imgUrl={room.image_url}
          />
          {errors.image_url && (
            <span className="input-error">{errors.image_url.message}</span>
          )}

          <Form.Label>Label Appearance (for individual space)</Form.Label>
          <select
            name="isLabelHidden"
            id="isLabelHidden"
            ref={register}
            className="EditRoomForm__dropdown"
          >
            {labelOptions}
          </select>

          <Button
            disabled={isUpdating || isDeleting}
            onClick={deleteSelectedRoom}
          >
            Delete room
          </Button>
          {error && <div>Error: {error}</div>}
        </div>

        <div className="EditRoomForm__footer">
          <Button onClick={handleBackClick}>Back</Button>
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
