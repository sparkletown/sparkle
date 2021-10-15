import React, { useCallback, useEffect, useMemo } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsync, useAsyncFn } from "react-use";

import {
  BACKGROUND_IMG_TEMPLATES,
  DEFAULT_EMBED_URL,
  DEFAULT_SHOW_SHOUTOUTS,
  HAS_GRID_TEMPLATES,
  HAS_REACTIONS_TEMPLATES,
  IFRAME_TEMPLATES,
  ROOM_TAXON,
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
  ZOOM_URL_TEMPLATES,
} from "settings";

import { deleteRoom, RoomInput, upsertRoom } from "api/admin";
import { fetchVenue, updateVenueNG } from "api/venue";

import { Room } from "types/rooms";
import { RoomVisibility, VenueTemplate } from "types/venues";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { roomEditSchema } from "pages/Admin/Details/ValidationSchema";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";

import { ButtonNG } from "components/atoms/ButtonNG";
import ImageInput from "components/atoms/ImageInput";
import { InputField } from "components/atoms/InputField";
import { PortalVisibility } from "components/atoms/PortalVisibility";
import { Toggler } from "components/atoms/Toggler";

import "./SpaceEditForm.scss";

export interface SpaceEditFormProps {
  room: Room;
  updatedRoom?: Room;
  roomIndex: number;
  onBackClick: (roomIndex: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  venueVisibility?: RoomVisibility;
}

export const SpaceEditForm: React.FC<SpaceEditFormProps> = ({
  room,
  updatedRoom,
  roomIndex,
  venueVisibility,
  onBackClick,
  onDelete,
  onEdit,
}) => {
  const { user } = useUser();

  const venueId = useVenueId();

  const roomVenueId = room?.url?.split("/").pop();

  const {
    loading: isLoadingRoomVenue,
    error: roomVenueError,
    value: roomVenue,
  } = useAsync(async () => {
    if (!roomVenueId) return;

    return await fetchVenue(roomVenueId);
  }, [roomVenueId]);

  const defaultValues = useMemo(
    () => ({
      room: {
        title: room.title ?? "",
        url: room.url ?? "",
        subtitle: room.subtitle ?? "",
        about: room.about ?? "",
        template: room.template ?? undefined,
        image_url: room.image_url ?? "",
        visibility: room.visibility ?? venueVisibility,
      },
      venue: {
        mapBackgroundImage: roomVenue?.mapBackgroundImageUrl ?? "",
        zoomUrl: roomVenue?.zoomUrl ?? "",
        iframeUrl: roomVenue?.iframeUrl ?? "",
        showGrid: roomVenue?.showGrid ?? false,
        showReactions: roomVenue?.showReactions ?? false,
        showShoutouts: roomVenue?.showShoutouts ?? DEFAULT_SHOW_SHOUTOUTS,
        auditoriumColumns:
          roomVenue?.auditoriumColumns ?? SECTION_DEFAULT_COLUMNS_COUNT,
        auditoriumRows: roomVenue?.auditoriumRows ?? SECTION_DEFAULT_ROWS_COUNT,
        columns: roomVenue?.columns ?? 0,
      },
    }),
    [
      room.about,
      room.image_url,
      room.subtitle,
      room.template,
      room.title,
      room.url,
      room.visibility,
      roomVenue?.auditoriumColumns,
      roomVenue?.auditoriumRows,
      roomVenue?.columns,
      roomVenue?.iframeUrl,
      roomVenue?.mapBackgroundImageUrl,
      roomVenue?.showGrid,
      roomVenue?.showReactions,
      roomVenue?.showShoutouts,
      roomVenue?.zoomUrl,
      venueVisibility,
    ]
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

  const changeBackgroundImageUrl = useCallback(
    (val: string) => {
      setValue("venue.mapBackgroundImage", val, false);
    },
    [setValue]
  );

  const updateVenueRoom = useCallback(async () => {
    if (!user || !roomVenueId) return;
    await updateVenueNG(
      {
        id: roomVenueId,
        ...venueValues,
        iframeUrl: venueValues.iframeUrl || DEFAULT_EMBED_URL,
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

  return (
    <Form onSubmit={handleSubmit(updateSelectedRoom)}>
      <div className="SpaceEditForm">
        <div className="SpaceEditForm__portal">
          <Form.Label>{ROOM_TAXON.capital} type</Form.Label>
          <InputField
            name="room.template"
            type="text"
            autoComplete="off"
            placeholder={`${ROOM_TAXON.capital} template`}
            error={errors?.room?.template}
            ref={register()}
            disabled
          />

          <Form.Label>Name your {ROOM_TAXON.lower}</Form.Label>
          <InputField
            name="room.title"
            type="text"
            autoComplete="off"
            placeholder={`${ROOM_TAXON.capital} name`}
            error={errors?.room?.title}
            ref={register()}
          />

          <Form.Label>{ROOM_TAXON.capital} subtitle</Form.Label>
          <InputField
            name="room.subtitle"
            type="textarea"
            autoComplete="off"
            placeholder="Subtitle (optional)"
            error={errors?.room?.subtitle}
            ref={register()}
          />

          <Form.Label>{ROOM_TAXON.capital} description</Form.Label>
          <textarea
            name="room.about"
            autoComplete="off"
            placeholder="Description (optional)"
            ref={register()}
          />
          {errors?.room?.about && (
            <span className="input-error">{errors?.room?.about.message}</span>
          )}

          <Form.Label>{ROOM_TAXON.capital} url</Form.Label>
          <InputField
            name="room.url"
            type="text"
            autoComplete="off"
            placeholder={`${ROOM_TAXON.capital} url`}
            error={errors?.room?.url}
            ref={register()}
          />

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

          <Form.Label>
            Change label appearance (overrides global settings)
          </Form.Label>
          <PortalVisibility name="room.visibility" register={register} />

          {!roomVenue && roomVenueError && (
            <>
              <div>
                The venue linked to this portal could not be fetched properly.
                Make sure it is a child of this world and try again.
              </div>
              <div>{roomVenueError.message}</div>
            </>
          )}

          {!isLoadingRoomVenue && !!roomVenue && (
            <>
              {room.template &&
                BACKGROUND_IMG_TEMPLATES.includes(
                  room.template as VenueTemplate
                ) && (
                  <>
                    <Form.Label>{ROOM_TAXON.capital} background</Form.Label>
                    <ImageInput
                      onChange={changeBackgroundImageUrl}
                      name="venue.mapBackgroundImage"
                      setValue={setValue}
                      register={register}
                      small
                      nameWithUnderscore
                      imgUrl={
                        roomVenue?.mapBackgroundImageUrl ??
                        venueValues.mapBackgroundImage
                      }
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
                    <Toggler
                      name="venue.showReactions"
                      forwardedRef={register}
                    />
                  </div>
                )}

              {room.template &&
                HAS_REACTIONS_TEMPLATES.includes(
                  room.template as VenueTemplate
                ) && (
                  <div className="toggle-room">
                    <h4 className="italic input-header">Show shoutouts</h4>
                    <Toggler
                      name="venue.showShoutouts"
                      forwardedRef={register}
                    />
                  </div>
                )}

              {room.template === VenueTemplate.auditorium && (
                <>
                  <div className="input-container">
                    <h4 className="italic input-header">
                      Number of seats columns
                    </h4>
                    <input
                      defaultValue={SECTION_DEFAULT_COLUMNS_COUNT}
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
                    <h4 className="italic input-header">
                      Number of seats rows
                    </h4>
                    <input
                      defaultValue={SECTION_DEFAULT_ROWS_COUNT}
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
                        Not editable. The number of rows is derived from the
                        number of specified columns and the width:height ratio
                        of the party map, to keep the two aligned.
                      </div>
                    </div>
                  </>
                )}
            </>
          )}

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
          <div className="SpaceEditForm__loading-indicator">
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
