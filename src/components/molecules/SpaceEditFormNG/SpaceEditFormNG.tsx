import React, { useCallback, useEffect, useMemo } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsync, useAsyncFn } from "react-use";

import {
  DEFAULT_REACTIONS_AUDIBLE,
  DEFAULT_SECTIONS_AMOUNT,
  DEFAULT_SHOW_REACTIONS,
  DEFAULT_SHOW_SHOUTOUTS,
  DEFAULT_VENUE_AUTOPLAY,
  MAX_SECTIONS_AMOUNT,
  MIN_SECTIONS_AMOUNT,
  ROOM_TAXON,
} from "settings";
import { DEFAULT_EMBED_URL } from "settings/embedUrlSettings";

import { deleteRoom, upsertRoom } from "api/admin";
import { fetchVenue, updateVenueNG } from "api/venue";

import { Room, RoomInput } from "types/rooms";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";

import { spaceEditNGSchema } from "forms/spaceEditNGSchema";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useSpaceParams } from "hooks/useSpaceParams";
import { useUser } from "hooks/useUser";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSubTitle";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { AdminSpacesListItem } from "components/organisms/AdminVenueView/components/AdminSpacesListItem";

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
import { Toggler } from "components/atoms/Toggler";

import { AdminCheckbox } from "../AdminCheckbox";

import "./SpaceEditFormNG.scss";

export interface SpaceEditFormNGProps {
  room: Room;
  updatedRoom?: Room;
  roomIndex: number;
  onBackClick: (roomIndex: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

// NOTE: add the keys of those errors that their respective fields have handled
const HANDLED_ERRORS: string[] = [
  "image_url",
  "iframeUrl",
  "autoPlay",
  "bannerImageUrl",
  "numberOfSections",
];

export const SpaceEditFormNG: React.FC<SpaceEditFormNGProps> = ({
  room,
  updatedRoom,
  roomIndex,
  onBackClick,
  onDelete,
  onEdit,
}) => {
  const { user } = useUser();

  const spaceSlug = useSpaceParams();
  const { spaceId } = useSpaceBySlug(spaceSlug);

  const spaceSlugFromPortal = room?.url?.split("/").pop();
  const { spaceId: spaceIdFromPortal } = useSpaceBySlug(spaceSlugFromPortal);

  const { loading: isLoadingPortal, value: portal } = useAsync(async () => {
    if (!spaceIdFromPortal) return;

    return await fetchVenue(spaceIdFromPortal);
  }, [spaceIdFromPortal]);

  const defaultValues = useMemo(
    () => ({
      name: portal?.name ?? "",
      subtitle: portal?.config?.landingPageConfig?.subtitle ?? "",
      description: portal?.config?.landingPageConfig?.description ?? "",
      image_url: room.image_url ?? "",
      iframeUrl: portal?.iframeUrl ?? "",
      autoPlay: portal?.autoPlay ?? DEFAULT_VENUE_AUTOPLAY,
      bannerImageUrl: portal?.config?.landingPageConfig.coverImageUrl ?? "",
      roomVisibility: room?.visibility,
      parentId: portal?.parentId ?? "",
      showReactions: portal?.showReactions ?? DEFAULT_SHOW_REACTIONS,
      showShoutouts: portal?.showShoutouts ?? DEFAULT_SHOW_SHOUTOUTS,
      isReactionsMuted: portal?.isReactionsMuted ?? DEFAULT_REACTIONS_AUDIBLE,
      numberOfSections: portal?.sectionsCount ?? DEFAULT_SECTIONS_AMOUNT,
    }),
    [room.image_url, portal, room?.visibility]
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
    validationSchema: spaceEditNGSchema,
    defaultValues,
  });
  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const values = watch();

  const changePortalImageUrl = useCallback(
    (val: string) => {
      setValue("image_url", val, false);
    },
    [setValue]
  );

  const changeBackgroundImageUrl = useCallback(
    (val: string) => {
      setValue("bannerImageUrl", val, false);
    },
    [setValue]
  );

  const updateVenueRoom = useCallback(async () => {
    if (!user || !spaceIdFromPortal) return;

    const embedUrl = convertToEmbeddableUrl({
      url: values.iframeUrl,
      autoPlay: values.autoPlay,
    });

    await updateVenueNG(
      {
        id: spaceIdFromPortal,
        iframeUrl: embedUrl || DEFAULT_EMBED_URL,
        autoPlay: values.autoPlay,
        bannerImageUrl: values.bannerImageUrl,
        name: values.name,
        description: { text: values.description },
        subtitle: values.subtitle,
        parentId: values.parentId,
        showShoutouts: values.showShoutouts,
        showReactions: values.showReactions,
        isReactionsMuted: values.isReactionsMuted,
        numberOfSections: values.numberOfSections,
        template: portal?.template,
        worldId: portal?.worldId,
      },
      user
    );
  }, [
    user,
    spaceIdFromPortal,
    values.iframeUrl,
    values.autoPlay,
    values.bannerImageUrl,
    values.name,
    values.description,
    values.subtitle,
    values.parentId,
    values.showShoutouts,
    values.showReactions,
    values.isReactionsMuted,
    values.numberOfSections,
    portal?.template,
    portal?.worldId,
  ]);

  const [{ loading: isUpdating }, updateSelectedRoom] = useAsyncFn(
    async (input) => {
      if (!user || !spaceId) return;

      const portalData: RoomInput = {
        ...(room as RoomInput),
        ...(updatedRoom as RoomInput),
        visibility: input.roomVisibility,
        ...values,
      };

      await upsertRoom(portalData, spaceId, user, roomIndex);
      await updateVenueRoom();

      onEdit?.();
    },
    [
      onEdit,
      room,
      roomIndex,
      updateVenueRoom,
      updatedRoom,
      user,
      values,
      spaceId,
    ]
  );

  const [
    { loading: isDeleting, error },
    deleteSelectedRoom,
  ] = useAsyncFn(async () => {
    if (!spaceId) return;

    await deleteRoom(spaceId, room);
    onDelete && onDelete();
  }, [spaceId, room, onDelete]);

  const handleBackClick = useCallback(() => {
    onBackClick(roomIndex);
  }, [onBackClick, roomIndex]);

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
    () => ownedVenues.find(({ id }) => id === portal?.parentId),
    [portal?.parentId, ownedVenues]
  );

  return (
    <div className="SpaceEditFormNG">
      <Form onSubmit={handleSubmit(updateSelectedRoom)}>
        <AdminSidebarTitle>
          Edit {room.template} space: {room.title}
        </AdminSidebarTitle>
        <AdminSidebarSubTitle>
          The url of your space is <span>{room.url}</span>
        </AdminSidebarSubTitle>
        <AdminSpacesListItem title="The basics" isOpened>
          <>
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
            <AdminSection title="Livestream URL" withLabel>
              <AdminInput
                name="iframeUrl"
                placeholder="Livestream URL"
                register={register}
                errors={errors}
              />
            </AdminSection>
            <AdminSection>
              <Toggler
                name="autoPlay"
                forwardedRef={register}
                containerClassName="SpaceEditFormNG__toggler"
                label="Autoplay"
              />
            </AdminSection>
          </>
        </AdminSpacesListItem>
        <AdminSpacesListItem title="Appearance" isOpened>
          <AdminSection title="Default portal appearance">
            <PortalVisibility
              getValues={getValues}
              name="roomVisibility"
              register={register}
              setValue={setValue}
            />
          </AdminSection>
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
              onChange={changePortalImageUrl}
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
        <AdminSpacesListItem title="Extras" isOpened>
          <AdminSection>
            <Toggler
              name="showShoutouts"
              forwardedRef={register}
              containerClassName="SpaceEditFormNG__toggler"
              label="Enable shoutouts"
            />
          </AdminSection>
          <AdminSection>
            <Toggler
              name="showReactions"
              forwardedRef={register}
              containerClassName="SpaceEditFormNG__toggler"
              label="Reaction emojis"
            />
          </AdminSection>
          <AdminSection>
            <AdminCheckbox
              variant="flip-switch"
              name="isReactionsMuted"
              register={register}
              disabled={!values.showReactions}
              displayOn="Audible"
              displayOff="Muted"
            />
          </AdminSection>
          <AdminSection title="Capacity (optional)">
            <div className="SpaceEditFormNG__capacity">
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
        <ButtonNG
          variant="danger"
          loading={isDeleting}
          disabled={isUpdating || isDeleting}
          onClick={deleteSelectedRoom}
        >
          Delete {ROOM_TAXON.lower}
        </ButtonNG>
        <FormErrors errors={errors} omitted={HANDLED_ERRORS} />
        <SubmitError error={error} />

        {isLoadingPortal && (
          <AdminSection title="Loading space information...">
            <Spinner animation="border" role="status" />
          </AdminSection>
        )}

        <AdminSidebarFooter onClickCancel={handleBackClick}>
          <ButtonNG
            className="AdminSidebarFooter__button--larger"
            type="submit"
            variant="primary"
            loading={isUpdating}
            disabled={isUpdating || isDeleting}
          >
            Save changes
          </ButtonNG>
        </AdminSidebarFooter>
      </Form>
    </div>
  );
};
