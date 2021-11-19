import React, { useCallback, useEffect, useMemo } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsync, useAsyncFn } from "react-use";

import {
  BACKGROUND_IMG_TEMPLATES,
  DEFAULT_EMBED_URL,
  DEFAULT_SHOW_SHOUTOUTS,
  DISABLED_DUE_TO_1253,
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

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { isExternalPortal } from "utils/url";

import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { roomEditSchema } from "pages/Admin/Details/ValidationSchema";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSpacesListItem } from "components/organisms/AdminVenueView/components/AdminSpacesListItem";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { AdminTextarea } from "components/molecules/AdminTextarea";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";
import ImageInput from "components/atoms/ImageInput";
import { InputField } from "components/atoms/InputField";
import { PortalVisibility } from "components/atoms/PortalVisibility";
import { SpacesDropdown } from "components/atoms/SpacesDropdown";

import "./SpaceEditForm.scss";

const HANDLED_ERRORS = [
  "room.template",
  "room.title",
  "room.subtitle",
  "room.about",
  "room.url",
  "room.image_url",
  "venue.mapBackgroundImage",
  "venue.iframeUrl",
  "venue.zoomUrl",
  "venue.auditoriumColumns",
  "venue.auditoriumRows",
  "venue.columns",
];

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
    error: fetchError,
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
        autoPlay: roomVenue?.autoPlay ?? false,
        isReactionsMuted: roomVenue?.isReactionsMuted ?? false,
        parentId: roomVenue?.parentId ?? "",
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
      roomVenue?.autoPlay,
      roomVenue?.isReactionsMuted,
      roomVenue?.parentId,
      venueVisibility,
    ]
  );

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    errors,
  } = useForm({
    reValidateMode: "onChange",
    validationSchema: roomEditSchema,
    defaultValues,
  });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const roomValues = watch("room");
  const venueValues = watch("venue");
  const values = watch();

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

    const embedUrl = convertToEmbeddableUrl({
      url: venueValues.iframeUrl,
      autoPlay: roomVenue?.autoPlay,
    });

    await updateVenueNG(
      {
        id: roomVenueId,
        worldId: roomVenue?.worldId,
        ...venueValues,
        iframeUrl: embedUrl || DEFAULT_EMBED_URL,
      },
      user
    );
  }, [roomVenueId, user, venueValues, roomVenue?.autoPlay, roomVenue?.worldId]);

  const [
    { loading: isUpdating, error: updateError },
    updateSelectedRoom,
  ] = useAsyncFn(
    async (input) => {
      if (!user || !venueId) return;

      const roomData: RoomInput = {
        ...(room as RoomInput),
        ...(updatedRoom as RoomInput),
        ...roomValues,
        visibility: input.room.visibility,
      };

      await upsertRoom(roomData, venueId, user, roomIndex);
      room.template && (await updateVenueRoom());

      onEdit?.();
    },
    [
      onEdit,
      room,
      roomIndex,
      updateVenueRoom,
      updatedRoom,
      user,
      roomValues,
      venueId,
    ]
  );

  const [
    { loading: isDeleting, error: deleteError },
    deleteSelectedRoom,
  ] = useAsyncFn(async () => {
    if (!venueId) return;

    await deleteRoom(venueId, room);
    onDelete && onDelete();
  }, [venueId, room, onDelete]);

  const handleBackClick = useCallback(() => {
    onBackClick(roomIndex);
  }, [onBackClick, roomIndex]);

  const isReactionsMutedDisabled = !(
    values?.venue?.showReactions ?? venueValues?.showReactions
  );

  const { ownedVenues } = useOwnedVenues({});

  const backButtonOptionList = useMemo(
    () =>
      Object.fromEntries(
        ownedVenues
          .filter(({ id, worldId }) =>
            roomVenue?.worldId !== worldId || id === roomVenueId ? false : true
          )
          .map((venue) => [venue.id, venue])
      ),
    [ownedVenues, roomVenue?.worldId, roomVenueId]
  );

  const parentSpace = useMemo(
    () => ownedVenues.find(({ id }) => id === roomVenue?.parentId),
    [ownedVenues, roomVenue?.parentId]
  );

  return (
    <Form onSubmit={handleSubmit(updateSelectedRoom)}>
      <div className="SpaceEditForm">
        <div className="SpaceEditForm__portal">
          <AdminSpacesListItem title="The basics" isOpened>
            <AdminInput
              name="room.template"
              autoComplete="off"
              placeholder={`${ROOM_TAXON.capital} template`}
              label={`${ROOM_TAXON.capital} type`}
              register={register}
              errors={errors}
              disabled
            />

            <AdminInput
              name="room.title"
              autoComplete="off"
              placeholder={`${ROOM_TAXON.capital} name`}
              label={`Name your ${ROOM_TAXON.lower}`}
              register={register}
              errors={errors}
            />

            <AdminInput
              name="room.subtitle"
              autoComplete="off"
              placeholder="Subtitle (optional)"
              label={`${ROOM_TAXON.capital} subtitle`}
              register={register}
              errors={errors}
            />

            <AdminTextarea
              name="room.about"
              autoComplete="off"
              placeholder="Description (optional)"
              label={`${ROOM_TAXON.capital} description`}
              register={register}
              errors={errors}
            />

            {isExternalPortal(room) ? (
              <AdminInput
                name="room.url"
                autoComplete="off"
                label={`${ROOM_TAXON.capital} url`}
                placeholder={`${ROOM_TAXON.capital} url`}
                register={register}
                errors={errors}
              />
            ) : (
              // NOTE: Save button doesn't work if the value is missing
              <input name="room.url" type="hidden" ref={register} />
            )}

            <AdminSection
              title="Select the parent space for the “back” button"
              withLabel
            >
              <SpacesDropdown
                portals={backButtonOptionList}
                setValue={setValue}
                register={register}
                fieldName="venue.parentId"
                parentSpace={parentSpace}
                error={errors?.venue?.parentId}
              />
            </AdminSection>
          </AdminSpacesListItem>
          <AdminSpacesListItem title="Appearance" isOpened>
            <AdminSection
              withLabel
              title={`${ROOM_TAXON.capital} image`}
              subtitle="(overrides global settings)"
            >
              {/* @debt: Create AdminImageInput to wrap ImageInput with error handling and labels */}
              {/* ie. PortalVisibility/AdminInput */}
              <ImageInput
                onChange={changeRoomImageUrl}
                name="room.image"
                setValue={setValue}
                register={register}
                small
                nameWithUnderscore
                imgUrl={room.image_url}
                error={errors?.room?.image_url}
              />
            </AdminSection>

            <AdminSection
              withLabel
              title="Change label appearance"
              subtitle="(overrides global settings)"
            >
              <PortalVisibility
                getValues={getValues}
                name="room.visibility"
                register={register}
                setValue={setValue}
              />
            </AdminSection>
            {!isLoadingRoomVenue && !!roomVenue && (
              <>
                {room.template &&
                  // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
                  BACKGROUND_IMG_TEMPLATES.includes(
                    room.template as VenueTemplate
                  ) && (
                    <>
                      <Form.Label>{ROOM_TAXON.capital} background</Form.Label>
                      {/* @debt: Create AdminImageInput to wrap ImageInput with error handling and labels */}
                      {/* ie. PortalVisibility/AdminInput */}
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
                        error={errors?.venue?.mapBackgroundImage}
                      />
                    </>
                  )}

                {room.template &&
                  // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
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
                      <AdminCheckbox
                        variant="toggler"
                        name="venue.autoPlay"
                        register={register}
                        label="Enable autoplay"
                      />
                    </>
                  )}

                {room.template &&
                  // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
                  ZOOM_URL_TEMPLATES.includes(
                    room.template as VenueTemplate
                  ) && (
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
                    </div>
                  )}

                {!DISABLED_DUE_TO_1253 &&
                  room.template &&
                  // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
                  HAS_GRID_TEMPLATES.includes(
                    room.template as VenueTemplate
                  ) && (
                    <AdminCheckbox
                      name="venue.showGrid"
                      label="Show grid layout"
                      variant="toggler"
                      register={register}
                    />
                  )}

                {room.template &&
                  // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
                  HAS_REACTIONS_TEMPLATES.includes(
                    room.template as VenueTemplate
                  ) && (
                    <>
                      <AdminCheckbox
                        name="venue.showShoutouts"
                        label="Show shoutouts"
                        variant="toggler"
                        register={register}
                      />
                      <AdminCheckbox
                        name="venue.showReactions"
                        label="Show reactions"
                        variant="toggler"
                        register={register}
                      />
                      <AdminSection>
                        <AdminCheckbox
                          variant="flip-switch"
                          name="venue.isReactionsMuted"
                          register={register}
                          disabled={isReactionsMutedDisabled}
                          displayOn="Audible"
                          displayOff="Muted"
                        />
                      </AdminSection>
                    </>
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

                {!DISABLED_DUE_TO_1253 &&
                  room.template &&
                  HAS_GRID_TEMPLATES.includes(room.template as VenueTemplate) &&
                  venueValues.showGrid && (
                    <>
                      <div className="input-container">
                        <h4 className="italic input-header">
                          Number of columns
                        </h4>
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
          </AdminSpacesListItem>
          {!roomVenue && fetchError && (
            <>
              <div>
                The space linked to this portal could not be fetched properly.
                Make sure it is a child of this world and try again.
              </div>
              <div>{fetchError.message}</div>
            </>
          )}

          <SubmitError error={deleteError} />
          <ButtonNG
            variant="danger"
            loading={isUpdating || isDeleting}
            disabled={isUpdating || isDeleting}
            onClick={deleteSelectedRoom}
          >
            Delete {ROOM_TAXON.lower}
          </ButtonNG>

          <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
          <SubmitError error={updateError} />
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
