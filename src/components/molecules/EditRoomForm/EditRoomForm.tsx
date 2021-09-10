import React, { useCallback, useMemo } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import {
  BACKGROUND_IMG_TEMPLATES,
  DEFAULT_AUDIENCE_COLUMNS_NUMBER,
  DEFAULT_AUDIENCE_ROWS_NUMBER,
  HAS_GRID_TEMPLATES,
  HAS_REACTIONS_TEMPLATES,
  IFRAME_TEMPLATES,
  ZOOM_URL_TEMPLATES,
} from "settings";

import { deleteRoom, RoomInput, upsertRoom } from "api/admin";
import { updateVenueNG } from "api/venue";

import { RoomData_v2 } from "types/rooms";
import { VenueTemplate } from "types/venues";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { roomEditSchema } from "pages/Admin/Details/ValidationSchema";

import ImageInput from "components/atoms/ImageInput";
import { InputField } from "components/atoms/InputField";
import { Toggler } from "components/atoms/Toggler";

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

  const { relatedVenues } = useRelatedVenues({ currentVenueId: venueId });

  const roomVenue = useMemo(
    () => relatedVenues.find((venue) => room?.url?.endsWith(`/${venue.id}`)),
    [relatedVenues, room?.url]
  );

  const { register, handleSubmit, setValue, watch, errors } = useForm({
    reValidateMode: "onChange",
    validationSchema: roomEditSchema,
    defaultValues: {
      room: {
        title: room.title ?? "",
        url: room.url ?? "",
        subtitle: room.subtitle ?? "",
        about: room.about ?? "",
        template: room.template ?? undefined,
        image_url: room.image_url ?? "",
      },
      venue: {
        mapBackgroundImage: roomVenue?.mapBackgroundImageUrl ?? "",
        zoomUrl: roomVenue?.zoomUrl ?? "",
        iframeUrl: roomVenue?.iframeUrl ?? "",
        showGrid: roomVenue?.showGrid ?? false,
        showReactions: roomVenue?.showReactions ?? false,
        showShoutouts: roomVenue?.showShoutouts ?? false,
        auditoriumColumns: roomVenue?.auditoriumColumns ?? 0,
        auditoriumRows: roomVenue?.auditoriumRows ?? 0,
        columns: roomVenue?.columns ?? 0,
      },
    },
  });

  const values = watch("room");
  const venueValues = watch("venue");

  const changeRoomImageUrl = useCallback(
    (val: string) => {
      setValue("room.image_url", val, false);
    },
    [setValue]
  );

  const changeBackgroundImageUrl = useCallback(
    (val: string) => {
      setValue("venue.mapBackgroundImage", val, false);
    },
    [setValue]
  );

  console.log(venueValues);

  const updateVenueRoom = useCallback(async () => {
    console.log("1", roomVenue);

    if (!user || !roomVenue?.id) return;
    await updateVenueNG({
      id: roomVenue.id,
      ...venueValues,
    });
  }, [roomVenue, user, venueValues]);

  const [{ loading: isUpdating }, updateSelectedRoom] = useAsyncFn(async () => {
    if (!user || !venueId) return;

    const roomData: RoomInput = {
      ...(room as RoomInput),
      ...(updatedRoom as RoomInput),
      ...values,
    };

    await upsertRoom(roomData, venueId, user, roomIndex);
    console.log(room.template);
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

  return (
    <Form onSubmit={handleSubmit(updateSelectedRoom)}>
      <div className="EditRoomForm">
        <div className="EditRoomForm__room">
          <Form.Label>Room type</Form.Label>
          <InputField
            name="room.template"
            type="text"
            autoComplete="off"
            placeholder="Room template"
            error={errors?.room?.template}
            ref={register()}
            disabled
          />

          <Form.Label>Name your room</Form.Label>
          <InputField
            name="room.title"
            type="text"
            autoComplete="off"
            placeholder="Room name"
            error={errors?.room?.title}
            ref={register()}
          />

          <Form.Label>Room subtitle</Form.Label>
          <InputField
            name="room.subtitle"
            type="textarea"
            autoComplete="off"
            placeholder="Subtitle (optional)"
            error={errors?.room?.subtitle}
            ref={register()}
          />

          <Form.Label>Room description</Form.Label>
          <textarea
            name="room.about"
            autoComplete="off"
            placeholder="Description (optional)"
            ref={register()}
          />
          {errors?.room?.about && (
            <span className="input-error">{errors?.room?.about.message}</span>
          )}

          <Form.Label>Room url</Form.Label>
          <InputField
            name="room.url"
            type="text"
            autoComplete="off"
            placeholder="Room url"
            error={errors?.room?.url}
            ref={register()}
          />

          <Form.Label>Room image</Form.Label>
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

          {room.template &&
            BACKGROUND_IMG_TEMPLATES.includes(
              room.template as VenueTemplate
            ) && (
              <>
                <Form.Label>Room background</Form.Label>
                <ImageInput
                  onChange={changeBackgroundImageUrl}
                  name="venue.mapBackgroundImage"
                  setValue={setValue}
                  register={register}
                  small
                  nameWithUnderscore
                  imgUrl={venueValues?.mapBackgroundImage}
                />
                {errors?.venue?.mapBackgroundImage && (
                  <span className="input-error">
                    {errors?.venue?.mapBackgroundImage.message}
                  </span>
                )}
              </>
            )}

          {room.template &&
            IFRAME_TEMPLATES.includes(room.template as VenueTemplate) && (
              <>
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
                  <span className="input-error">
                    {errors?.venue?.iframeUrl}
                  </span>
                )}
              </>
            )}

          {room.template &&
            ZOOM_URL_TEMPLATES.includes(room.template as VenueTemplate) && (
              <div>
                <Form.Label>URL</Form.Label>
                <InputField
                  name="venue.zoomUrl"
                  type="text"
                  autoComplete="off"
                  placeholder="URL"
                  error={errors?.venue?.zoomUrl}
                  ref={register()}
                />
                {errors?.venue?.zoomUrl && (
                  <span className="input-error">
                    {errors?.venue?.zoomUrl.message}
                  </span>
                )}
              </div>
            )}

          {room.template &&
            HAS_GRID_TEMPLATES.includes(room.template as VenueTemplate) && (
              <div className="toggle-room">
                <h4 className="italic input-header">Show grid layout</h4>
                <Toggler name="venue.showGrid" forwardedRef={register} />
              </div>
            )}

          {room.template &&
            HAS_REACTIONS_TEMPLATES.includes(
              room.template as VenueTemplate
            ) && (
              <div className="toggle-room">
                <h4 className="italic input-header">Show reactions</h4>
                <Toggler name="venue.showReactions" forwardedRef={register} />
              </div>
            )}

          {room.template &&
            HAS_REACTIONS_TEMPLATES.includes(
              room.template as VenueTemplate
            ) && (
              <div className="toggle-room">
                <h4 className="italic input-header">Show shoutouts</h4>
                <Toggler name="venue.showShoutouts" forwardedRef={register} />
              </div>
            )}

          {room.template === VenueTemplate.auditorium && (
            <>
              <div className="input-container">
                <h4 className="italic input-header">Number of seats columns</h4>
                <input
                  defaultValue={DEFAULT_AUDIENCE_COLUMNS_NUMBER}
                  min={5}
                  name="venue.auditoriumColumns"
                  type="number"
                  ref={register}
                  className="align-left"
                  placeholder="Number of seats columns"
                />
                {errors?.venue?.auditoriumColumns ? (
                  <span className="input-error">
                    {errors?.venue?.auditoriumColumns.message}
                  </span>
                ) : null}
              </div>
              <div className="input-container">
                <h4 className="italic input-header">Number of seats rows</h4>
                <input
                  defaultValue={DEFAULT_AUDIENCE_ROWS_NUMBER}
                  name="venue.auditoriumRows"
                  type="number"
                  ref={register}
                  className="align-left"
                  placeholder="Number of seats rows"
                  min={5}
                />
                {errors?.venue?.auditoriumRows ? (
                  <span className="input-error">
                    {errors?.venue?.auditoriumRows.message}
                  </span>
                ) : null}
              </div>
            </>
          )}

          {room.template &&
            HAS_GRID_TEMPLATES.includes(room.template as VenueTemplate) &&
            venueValues.showGrid && (
              <>
                <div className="input-container">
                  <h4 className="italic input-header">Number of columns</h4>
                  <input
                    defaultValue={1}
                    name="venue.columns"
                    type="number"
                    ref={register}
                    className="align-left"
                    placeholder={`Number of grid columns`}
                  />
                  {errors?.venue?.columns ? (
                    <span className="input-error">
                      {errors?.venue?.columns.message}
                    </span>
                  ) : null}
                </div>
                <div className="input-container">
                  <h4 className="italic input-header">Number of rows</h4>
                  <div>
                    Not editable. The number of rows is derived from the number
                    of specified columns and the width:height ratio of the party
                    map, to keep the two aligned.
                  </div>
                </div>
              </>
            )}

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
