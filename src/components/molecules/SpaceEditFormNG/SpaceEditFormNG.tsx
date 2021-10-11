import React, { useCallback, useEffect, useMemo } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsync, useAsyncFn } from "react-use";

import { DEFAULT_VENUE_AUTOPLAY, ROOM_TAXON } from "settings";
import { DEFAULT_EMBED_URL } from "settings/embedUrlSettings";

import { deleteRoom, RoomInput, upsertRoom } from "api/admin";
import { fetchVenue, updateVenueNG } from "api/venue";

import { Room } from "types/rooms";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { roomEditNGSchema } from "pages/Admin/Details/ValidationSchema";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarSectionTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionTitle";
import { AdminSidebarSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSubTitle";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { AdminSpacesListItem } from "components/organisms/AdminVenueView/components/AdminSpacesListItem";

import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";

import { ButtonNG } from "components/atoms/ButtonNG";
import ImageInput from "components/atoms/ImageInput";
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
      image_url: room.image_url ?? "",
      bannerImageUrl: roomVenue?.config?.landingPageConfig.bannerImageUrl ?? "",
      venue: {
        iframeUrl: roomVenue?.iframeUrl ?? "",
        autoPlay: roomVenue?.autoPlay ?? DEFAULT_VENUE_AUTOPLAY,
      },
    }),
    [room.image_url, roomVenue]
  );

  const { register, handleSubmit, setValue, watch, reset, errors } = useForm({
    reValidateMode: "onChange",
    validationSchema: roomEditNGSchema,
    defaultValues,
  });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const values = watch();
  const venueValues = watch("venue");

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
    <Form
      onSubmit={handleSubmit(updateSelectedRoom)}
      className="SpaceEditFormNG"
    >
      <AdminSidebarTitle>
        Edit {room.template} space: {room.title}
      </AdminSidebarTitle>
      <AdminSidebarSubTitle>
        The url of your space is <span>{room.url}</span>
      </AdminSidebarSubTitle>
      <AdminSpacesListItem
        className="SpaceEditFormNG__list-item"
        title="The basics"
        isOpened
      >
        <>
          <AdminSidebarSectionTitle className="SpaceEditFormNG__section-title">
            Your content
          </AdminSidebarSectionTitle>
          <AdminSection title="Livestream URL" withLabel>
            <AdminInput
              name="venue.iframeUrl"
              placeholder="Livestream URL"
              register={register}
              errors={errors}
            />
          </AdminSection>
          <AdminSection title="Autoplay your embeded video">
            <Toggler name="venue.autoPlay" forwardedRef={register} />
          </AdminSection>
        </>
      </AdminSpacesListItem>
      <AdminSpacesListItem
        className="SpaceEditFormNG__list-item"
        title="Appearance"
        isOpened
      >
        <AdminSection title="Upload a banner photo">
          <ImageInput
            name="bannerImage"
            imgUrl={values.bannerImageUrl}
            error={errors.bannerImageUrl}
            isInputHidden={!values.bannerImageUrl}
            register={register}
            setValue={setValue}
          />
        </AdminSection>
        <AdminSection title="Upload a logo">
          <ImageInput
            name="image_url"
            imgUrl={values.image_url}
            error={errors.image_url}
            setValue={setValue}
            register={register}
            small
          />
        </AdminSection>
      </AdminSpacesListItem>

      <ButtonNG
        variant="danger"
        loading={isUpdating || isDeleting}
        disabled={isUpdating || isDeleting}
        onClick={deleteSelectedRoom}
      >
        Delete {ROOM_TAXON.lower}
      </ButtonNG>
      {error && <div>Error: {error}</div>}

      {isLoadingRoomVenue && (
        <div className="SpaceEditFormNG__loading-indicator">
          <Spinner animation="border" role="status" />
          <span>Loading space information...</span>
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
    </Form>
  );
};
