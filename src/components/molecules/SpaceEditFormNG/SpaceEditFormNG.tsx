import React, { useCallback, useEffect, useMemo } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsync, useAsyncFn } from "react-use";

import { ROOM_TAXON } from "settings";

import { deleteRoom, RoomInput, upsertRoom } from "api/admin";
import { fetchVenue, updateVenueNG } from "api/venue";

import { Room } from "types/rooms";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { roomEditSchema } from "pages/Admin/Details/ValidationSchema";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSubTitle";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";

import { ButtonNG } from "components/atoms/ButtonNG";
import ImageInput from "components/atoms/ImageInput";
import { InputField } from "components/atoms/InputField";
import { Toggler } from "components/atoms/Toggler";

import "./SpaceEditFormNG.scss";

interface SpaceEditFormNGProps {
  room: Room;
  updatedRoom?: Room;
  roomIndex: number;
  onBackClick: (roomIndex: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const SpaceEditFormNG: React.FC<SpaceEditFormNGProps> = ({
  room,
  updatedRoom,
  roomIndex,
  onBackClick,
  onDelete,
  onEdit,
}) => {
  const { user } = useUser();

  const venueId = useVenueId();

  const roomVenueId = room?.url?.split("/").pop();

  const {
    loading: isLoadingRoomVenue,
    value: roomVenue,
  } = useAsync(async () => {
    if (!roomVenueId) return;

    return await fetchVenue(roomVenueId);
  }, [roomVenueId]);

  const defaultValues = useMemo(
    () => ({
      room: {
        image_url: room.image_url ?? "",
      },
      venue: {
        iframeUrl: roomVenue?.iframeUrl ?? "",
      },
    }),
    [room.image_url, roomVenue?.iframeUrl]
  );

  const { register, handleSubmit, setValue, watch, reset, errors } = useForm({
    reValidateMode: "onChange",
    validationSchema: roomEditSchema,
    defaultValues,
  });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const values = watch("room");
  const venueValues = watch("venue");

  const changeRoomImageUrl = useCallback(
    (val: string) => {
      setValue("room.image_url", val, false);
    },
    [setValue]
  );

  const updateVenueRoom = useCallback(async () => {
    if (!user || !roomVenueId) return;
    await updateVenueNG(
      {
        id: roomVenueId,
        ...venueValues,
      },
      user
    );
  }, [roomVenueId, user, venueValues]);

  const [{ loading: isUpdating }, updateSelectedRoom] = useAsyncFn(async () => {
    if (!user || !venueId) return;

    const roomData: RoomInput = {
      ...(room as RoomInput),
      ...(updatedRoom as RoomInput),
      ...values,
    };

    await upsertRoom(roomData, venueId, user, roomIndex);
    room.template && (await updateVenueRoom());

    onEdit && onEdit();
  }, [
    onEdit,
    room,
    roomIndex,
    updateVenueRoom,
    updatedRoom,
    user,
    values,
    venueId,
  ]);

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

  console.log(!isLoadingRoomVenue && !!roomVenue);

  return (
    <Form onSubmit={handleSubmit(updateSelectedRoom)}>
      <div className="SpaceEditFormNG">
        <AdminSidebarTitle>
          Edit {room.template} space: {room.title}
        </AdminSidebarTitle>
        <AdminSidebarSubTitle>
          The url of your space is <span>{room.url}</span>
        </AdminSidebarSubTitle>
        <div className="SpaceEditFormNG__portal">
          <Form.Label>Livestream URL</Form.Label>
          <InputField
            name="venue.iframeUrl"
            type="text"
            autoComplete="off"
            placeholder="Livestream URL"
            error={errors?.venue?.iframeUrl}
            ref={register()}
          />
          {errors?.venue?.iframeUrl && (
            <span className="input-error">{errors?.venue?.iframeUrl}</span>
          )}
          <Form.Label>Autoplay your embeded video</Form.Label>
          <Toggler name="room.autoPlay" forwardedRef={register} />

          <div>
            <Form.Label>{ROOM_TAXON.capital} image</Form.Label>
            <ImageInput
              onChange={changeRoomImageUrl}
              name="room.image"
              setValue={setValue}
              register={register}
              small
              nameWithUnderscore
              imgUrl={room.image_url}
            />
            {errors?.room?.image_url && (
              <span className="input-error">
                {errors?.room?.image_url.message}
              </span>
            )}
          </div>

          <ButtonNG
            variant="danger"
            loading={isUpdating || isDeleting}
            disabled={isUpdating || isDeleting}
            onClick={deleteSelectedRoom}
          >
            Delete {ROOM_TAXON.lower}
          </ButtonNG>
          {error && <div>Error: {error}</div>}
        </div>

        {isLoadingRoomVenue && (
          <div className="SpaceEditFormNG__loading-indicator">
            <Spinner animation="border" role="status" />
            <span>Loading venue information...</span>
          </div>
        )}

        <AdminSidebarFooter onClickCancel={handleBackClick}>
          <ButtonNG
            className="AdminSidebarFooter__button--larger"
            type="submit"
            variant="primary"
            disabled={isUpdating || isDeleting}
          >
            Save changes
          </ButtonNG>
        </AdminSidebarFooter>
      </div>
    </Form>
  );
};
