import React, { useCallback } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { ROOM_TAXON } from "settings";

import { deleteRoom, RoomInput, upsertRoom } from "api/admin";

import { Room } from "types/rooms";
import { RoomVisibility } from "types/venues";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { roomEditSchema } from "pages/Admin/Details/ValidationSchema";

import {
  AdminSidebarFooter,
  AdminSidebarFooterProps,
} from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";

import { ButtonNG } from "components/atoms/ButtonNG";
import ImageInput from "components/atoms/ImageInput";
import { InputField } from "components/atoms/InputField";
import { PortalVisibility } from "components/atoms/PortalVisibility";

import "./EditRoomForm.scss";

interface EditRoomFormProps extends AdminSidebarFooterProps {
  room: Room;
  updatedRoom?: Room;
  roomIndex: number;
  onBackClick: (roomIndex: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  venueVisibility?: RoomVisibility;
}

export const EditRoomForm: React.FC<EditRoomFormProps> = ({
  room,
  updatedRoom,
  roomIndex,
  onBackClick,
  onDelete,
  onEdit,
  venueVisibility,
  ...sidebarFooterProps
}) => {
  const { user } = useUser();

  const venueId = useVenueId();

  const { register, handleSubmit, setValue, watch, errors } = useForm({
    reValidateMode: "onChange",
    validationSchema: roomEditSchema,
    defaultValues: {
      title: room.title,
      url: room.url,
      about: room.about,
      template: room.template,
      image_url: room.image_url,
      visibility: room.visibility ?? venueVisibility,
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

  return (
    <Form className="EditRoomForm" onSubmit={handleSubmit(updateSelectedRoom)}>
      <AdminSidebarFooter
        {...sidebarFooterProps}
        onClickCancel={handleBackClick}
      >
        <ButtonNG
          className="AdminSidebarFooter__button--larger"
          type="submit"
          variant="primary"
          disabled={isUpdating || isDeleting}
        >
          Save changes
        </ButtonNG>
      </AdminSidebarFooter>
      <div className="EditRoomForm__content">
        <Form.Label>{ROOM_TAXON.capital} type</Form.Label>
        <InputField
          name="template"
          type="text"
          autoComplete="off"
          placeholder="Room template"
          error={errors.template}
          ref={register()}
          disabled
        />

        <Form.Label>{ROOM_TAXON.capital} name</Form.Label>
        <InputField
          name="title"
          type="text"
          autoComplete="off"
          placeholder="Room name"
          error={errors.title}
          ref={register()}
        />

        <Form.Label>{ROOM_TAXON.capital} tagline</Form.Label>
        <InputField
          name="about"
          type="text"
          autoComplete="off"
          placeholder="About"
          error={errors.about}
          ref={register()}
        />

        <Form.Label>{ROOM_TAXON.capital} url</Form.Label>
        <InputField
          name="url"
          type="text"
          autoComplete="off"
          placeholder="Room url"
          error={errors.url}
          ref={register()}
        />

        <Form.Label>{ROOM_TAXON.capital} image</Form.Label>
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

        <Form.Label>
          Change label appearance (overrides global settings)
        </Form.Label>
        <PortalVisibility register={register} />

        <ButtonNG
          disabled={isUpdating || isDeleting}
          loading={isUpdating || isDeleting}
          onClick={deleteSelectedRoom}
          variant="danger"
        >
          Delete {ROOM_TAXON.lower}
        </ButtonNG>
        {error && <div>Error: {error}</div>}
      </div>
    </Form>
  );
};
