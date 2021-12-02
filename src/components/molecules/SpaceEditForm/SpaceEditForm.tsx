import React, { useCallback, useEffect, useMemo } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsync, useAsyncFn } from "react-use";

import {
  BACKGROUND_IMG_TEMPLATES,
  DEFAULT_EMBED_URL,
  DEFAULT_REACTIONS_AUDIBLE,
  DEFAULT_SECTIONS_AMOUNT,
  DEFAULT_SHOW_REACTIONS,
  DEFAULT_SHOW_SHOUTOUTS,
  DEFAULT_VENUE_AUTOPLAY,
  DISABLED_DUE_TO_1253,
  HAS_GRID_TEMPLATES,
  HAS_REACTIONS_TEMPLATES,
  IFRAME_TEMPLATES,
  MAX_SECTIONS_AMOUNT,
  MIN_SECTIONS_AMOUNT,
  ROOM_TAXON,
  SECTION_DEFAULT_COLUMNS_COUNT,
  SECTION_DEFAULT_ROWS_COUNT,
  ZOOM_URL_TEMPLATES,
} from "settings";

import { deleteRoom, upsertRoom } from "api/admin";
import { fetchVenue, updateVenueNG } from "api/venue";

import { Room, RoomInput } from "types/rooms";
import { VenueTemplate } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";

import { spaceEditSchema } from "forms/spaceEditSchema";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useUser } from "hooks/useUser";

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
  "name",
  "title",
  "subtitle",
  "image_url",
  "mapBackgroundImage",
  "iframeUrl",
  "zoomUrl",
  "auditoriumColumns",
  "auditoriumRows",
  "columns",
];

export interface SpaceEditFormProps {
  room: Room;
  updatedRoom?: Room;
  roomIndex: number;
  onBackClick: (roomIndex: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const SpaceEditForm: React.FC<SpaceEditFormProps> = ({
  room,
  updatedRoom,
  roomIndex,
  onBackClick,
  onDelete,
  onEdit,
}) => {
  const { user } = useUser();

  const { spaceSlug } = useSpaceParams();
  const { spaceId } = useSpaceBySlug(spaceSlug);

  const spaceSlugFromPortal = room?.url?.split("/").pop();
  const { spaceId: spaceIdFromPortal } = useSpaceBySlug(spaceSlugFromPortal);

  const {
    loading: isLoadingRoomVenue,
    error: fetchError,
    value: portal,
  } = useAsync(async () => {
    if (!spaceIdFromPortal) return;

    return await fetchVenue(spaceIdFromPortal);
  }, [spaceIdFromPortal]);

  const defaultValues = useMemo(
    () => ({
      name: portal?.name ?? "",
      subtitle: portal?.config?.landingPageConfig?.subtitle ?? "",
      description: portal?.config?.landingPageConfig?.description ?? "",
      mapBackgroundImage: portal?.mapBackgroundImageUrl ?? "",
      bannerImageUrl: portal?.config?.landingPageConfig.coverImageUrl ?? "",
      zoomUrl: portal?.zoomUrl ?? "",
      image_url: room.image_url ?? "",
      iframeUrl: portal?.iframeUrl ?? DEFAULT_EMBED_URL,
      showGrid: portal?.showGrid ?? false,
      showReactions: portal?.showReactions ?? DEFAULT_SHOW_REACTIONS,
      showShoutouts: portal?.showShoutouts ?? DEFAULT_SHOW_SHOUTOUTS,
      auditoriumColumns:
        portal?.auditoriumColumns ?? SECTION_DEFAULT_COLUMNS_COUNT,
      auditoriumRows: portal?.auditoriumRows ?? SECTION_DEFAULT_ROWS_COUNT,
      columns: portal?.columns ?? 0,
      autoPlay: portal?.autoPlay ?? DEFAULT_VENUE_AUTOPLAY,
      isReactionsMuted: portal?.isReactionsMuted ?? DEFAULT_REACTIONS_AUDIBLE,
      parentId: portal?.parentId ?? "",
      numberOfSections: portal?.sectionsCount ?? DEFAULT_SECTIONS_AMOUNT,
      roomVisibility: room?.visibility,
    }),
    [
      portal?.name,
      portal?.config?.landingPageConfig?.subtitle,
      portal?.config?.landingPageConfig?.description,
      portal?.config?.landingPageConfig.coverImageUrl,
      portal?.mapBackgroundImageUrl,
      portal?.zoomUrl,
      portal?.iframeUrl,
      portal?.showGrid,
      portal?.showReactions,
      portal?.showShoutouts,
      portal?.auditoriumColumns,
      portal?.auditoriumRows,
      portal?.columns,
      portal?.autoPlay,
      portal?.isReactionsMuted,
      portal?.parentId,
      portal?.sectionsCount,
      room.image_url,
      room?.visibility,
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
    validationSchema: spaceEditSchema,
    defaultValues,
    validationContext: {
      template: room.template,
    },
  });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const values = watch();

  const changeRoomImageUrl = useCallback(
    (val: string) => {
      setValue("image_url", val, false);
    },
    [setValue]
  );

  const changeBackgroundImageUrl = useCallback(
    (val: string) => {
      setValue("mapBackgroundImage", val, false);
    },
    [setValue]
  );

  const updateVenueRoom = useCallback(async () => {
    if (!user || !spaceIdFromPortal) return;

    const embedUrl = convertToEmbeddableUrl({
      url: values.iframeUrl,
      autoPlay: portal?.autoPlay,
    });

    await updateVenueNG(
      {
        id: spaceIdFromPortal,
        worldId: portal?.worldId,
        ...values,
        description: {
          text: values.description,
        },
        iframeUrl: embedUrl || DEFAULT_EMBED_URL,
      },
      user
    );
  }, [user, spaceIdFromPortal, values, portal?.autoPlay, portal?.worldId]);

  const [
    { loading: isUpdating, error: updateError },
    updateSelectedRoom,
  ] = useAsyncFn(
    async (input) => {
      if (!user || !spaceId) return;

      const roomData: RoomInput = {
        ...(room as RoomInput),
        ...(updatedRoom as RoomInput),
        ...values,
        visibility: input.visibility,
      };

      await upsertRoom(roomData, spaceId, user, roomIndex);
      room.template && (await updateVenueRoom());

      onEdit?.();
    },
    [
      user,
      spaceId,
      room,
      updatedRoom,
      values,
      roomIndex,
      updateVenueRoom,
      onEdit,
    ]
  );

  const [
    { loading: isDeleting, error: deleteError },
    deleteSelectedRoom,
  ] = useAsyncFn(async () => {
    if (!spaceId) return;

    await deleteRoom(spaceId, room);
    onDelete && onDelete();
  }, [spaceId, room, onDelete]);

  const handleBackClick = useCallback(() => {
    onBackClick(roomIndex);
  }, [onBackClick, roomIndex]);

  const isReactionsMutedDisabled = !values?.showReactions;

  const { ownedVenues } = useOwnedVenues({});

  const backButtonOptionList = useMemo(
    () =>
      Object.fromEntries(
        ownedVenues
          .filter(
            ({ id, worldId }) =>
              !(portal?.worldId !== worldId || id === spaceIdFromPortal)
          )
          .map((venue) => [venue.id, venue])
      ),
    [ownedVenues, portal?.worldId, spaceIdFromPortal]
  );

  const parentSpace = useMemo(
    () =>
      portal?.parentId
        ? ownedVenues.find(({ id }) => id === portal?.parentId)
        : { name: "" },
    [ownedVenues, portal?.parentId]
  );

  return (
    <Form onSubmit={handleSubmit(updateSelectedRoom)}>
      <div className="SpaceEditForm">
        <div className="SpaceEditForm__portal">
          <AdminSpacesListItem title="The basics" isOpened>
            <AdminSection title="Rename your space" withLabel>
              <AdminInput
                name="name"
                placeholder="Space Name"
                register={register}
                errors={errors}
                required
              />
            </AdminSection>
            <AdminSection title="Subtitle" withLabel>
              <AdminInput
                name="subtitle"
                placeholder="Subtitle for your space"
                register={register}
                errors={errors}
              />
            </AdminSection>
            <AdminSection title="Description" withLabel>
              <AdminTextarea
                name="description"
                placeholder={`Let your guests know what they’ll find when they join your space. Keep it short & sweet, around 2-3 sentences maximum. Be sure to indicate any expectations for their participation.`}
                register={register}
                errors={errors}
              />
            </AdminSection>
            <AdminSection
              title="Select the parent space for the “back” button"
              withLabel
            >
              <SpacesDropdown
                portals={backButtonOptionList}
                setValue={setValue}
                register={register}
                fieldName="parentId"
                parentSpace={parentSpace}
                error={errors?.parentId}
              />
            </AdminSection>
            <AdminSection title="Default portal appearance">
              <PortalVisibility
                getValues={getValues}
                name="roomVisibility"
                register={register}
                setValue={setValue}
              />
            </AdminSection>

            {/* @debt Is this shown anywhere in the client side? Should we remove this input?  */}
            <AdminSection title="Upload a highlight image" withLabel>
              <ImageInput
                onChange={changeBackgroundImageUrl}
                name="bannerImage"
                imgUrl={values.bannerImageUrl}
                error={errors.bannerImageUrl}
                isInputHidden={!values.bannerImageUrl}
                register={register}
                setValue={setValue}
              />
            </AdminSection>
            <AdminSection title="Upload a logo" withLabel>
              <ImageInput
                nameWithUnderscore
                onChange={changeRoomImageUrl}
                name="image"
                imgUrl={values.image_url}
                error={errors.image_url}
                setValue={setValue}
                register={register}
                small
                subtext="(A transparent 300 px square image works best)"
              />
            </AdminSection>
          </AdminSpacesListItem>
          <AdminSpacesListItem title="Embedable content" isOpened>
            {room.template &&
              // @debt use a single structure of type Record<VenueTemplate,TemplateInfo> to compile all these .includes() arrays' flags
              IFRAME_TEMPLATES.includes(room.template as VenueTemplate) && (
                <>
                  <AdminSection title="Livestream URL" withLabel>
                    <AdminInput
                      name="iframeUrl"
                      placeholder="Livestream URL"
                      register={register}
                      errors={errors}
                    />
                  </AdminSection>
                  <AdminCheckbox
                    name="autoPlay"
                    label="Autoplay"
                    variant="toggler"
                    register={register}
                  />
                </>
              )}

            {!isLoadingRoomVenue && !!portal && (
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
                        name="mapBackgroundImage"
                        setValue={setValue}
                        register={register}
                        small
                        nameWithUnderscore
                        imgUrl={
                          portal?.mapBackgroundImageUrl ??
                          values.mapBackgroundImage
                        }
                        error={errors?.mapBackgroundImage}
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
                        name="zoomUrl"
                        type="text"
                        autoComplete="off"
                        placeholder="URL"
                        error={errors?.zoomUrl}
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
                      name="showGrid"
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
                        name="showShoutouts"
                        label="Show shoutouts"
                        variant="toggler"
                        register={register}
                      />
                      <AdminCheckbox
                        name="showReactions"
                        label="Show reactions"
                        variant="toggler"
                        register={register}
                      />
                      <AdminSection>
                        <AdminCheckbox
                          variant="flip-switch"
                          name="isReactionsMuted"
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
                        name="auditoriumColumns"
                        type="number"
                        ref={register}
                        className="align-left"
                        placeholder="Number of seats columns"
                      />
                      {errors?.auditoriumColumns ? (
                        <span className="input-error">
                          {errors?.auditoriumColumns.message}
                        </span>
                      ) : null}
                    </div>
                    <div className="input-container">
                      <h4 className="italic input-header">
                        Number of seats rows
                      </h4>
                      <input
                        defaultValue={SECTION_DEFAULT_ROWS_COUNT}
                        name="auditoriumRows"
                        type="number"
                        ref={register}
                        className="align-left"
                        placeholder="Number of seats rows"
                        min={5}
                      />
                      {errors?.auditoriumRows ? (
                        <span className="input-error">
                          {errors?.auditoriumRows.message}
                        </span>
                      ) : null}
                    </div>
                  </>
                )}

                {!DISABLED_DUE_TO_1253 &&
                  room.template &&
                  HAS_GRID_TEMPLATES.includes(room.template as VenueTemplate) &&
                  values.showGrid && (
                    <>
                      <div className="input-container">
                        <h4 className="italic input-header">
                          Number of columns
                        </h4>
                        <input
                          defaultValue={1}
                          name="columns"
                          type="number"
                          ref={register}
                          className="align-left"
                          placeholder={`Number of grid columns`}
                        />
                        {errors?.columns ? (
                          <span className="input-error">
                            {errors?.columns.message}
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

          {room.template === VenueTemplate.auditorium && (
            <AdminSpacesListItem title="Extras" isOpened>
              <AdminSection title="Capacity (optional)">
                <div className="SpaceEditForm__capacity">
                  <div># Sections</div>
                  <div># Seats</div>
                  <div>Max seats</div>

                  <InputField
                    ref={register}
                    name="numberOfSections"
                    type="number"
                    min={MIN_SECTIONS_AMOUNT}
                    max={MAX_SECTIONS_AMOUNT}
                    error={errors.numberOfSections}
                  />

                  <div>x 200</div>
                  <div>= {200 * values.numberOfSections}</div>
                </div>
              </AdminSection>
            </AdminSpacesListItem>
          )}

          {!portal && fetchError && (
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
