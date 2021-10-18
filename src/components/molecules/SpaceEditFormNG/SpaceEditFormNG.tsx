import React, { useCallback, useEffect, useMemo } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsync, useAsyncFn } from "react-use";

import {
  DEFAULT_SHOW_SHOUTOUTS,
  DEFAULT_VENUE_AUTOPLAY,
  ROOM_TAXON,
} from "settings";
import { DEFAULT_EMBED_URL } from "settings/embedUrlSettings";

import { deleteRoom, RoomInput, upsertRoom } from "api/admin";
import { fetchVenue, updateVenueNG } from "api/venue";

import { Room } from "types/rooms";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { roomEditNGSchema } from "pages/Admin/Details/ValidationSchema";

import { AdminSidebarFooter } from "components/organisms/AdminVenueView/components/AdminSidebarFooter";
import { AdminSidebarSubTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSubTitle";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { AdminSpacesListItem } from "components/organisms/AdminVenueView/components/AdminSpacesListItem";

import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { FormErrors } from "components/molecules/FormErrors";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Checkbox } from "components/atoms/Checkbox";
import ImageInput from "components/atoms/ImageInput";
import { Toggler } from "components/atoms/Toggler";

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

  const venueId = useVenueId();

  const portalId = room?.url?.split("/").pop();

  const { loading: isLoadingPortal, value: portal } = useAsync(async () => {
    if (!portalId) return;

    return await fetchVenue(portalId);
  }, [portalId]);

  const defaultValues = useMemo(
    () => ({
      image_url: room.image_url ?? "",
      iframeUrl: portal?.iframeUrl ?? "",
      autoPlay: portal?.autoPlay ?? DEFAULT_VENUE_AUTOPLAY,
      bannerImageUrl: portal?.config?.landingPageConfig.coverImageUrl ?? "",
      showReactions: portal?.showReactions ?? false,
      showShoutouts: portal?.showShoutouts ?? DEFAULT_SHOW_SHOUTOUTS,
      isReactionsMuted: portal?.isReactionsMuted ?? false,
    }),
    [room.image_url, portal]
  );

  const { register, handleSubmit, setValue, watch, reset, errors } = useForm({
    reValidateMode: "onChange",
    validationSchema: roomEditNGSchema,
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
    if (!user || !portalId) return;

    await updateVenueNG(
      {
        id: portalId,
        iframeUrl: values.iframeUrl || DEFAULT_EMBED_URL,
        autoPlay: values.autoPlay,
        bannerImageUrl: values.bannerImageUrl,
        showShoutouts: values.showShoutouts,
        showReactions: values.showReactions,
        isReactionsMuted: values.isReactionsMuted,
      },
      user
    );
  }, [portalId, user, values]);

  const [{ loading: isUpdating }, updateSelectedRoom] = useAsyncFn(async () => {
    if (!user || !venueId) return;

    const portalData: RoomInput = {
      ...(room as RoomInput),
      ...(updatedRoom as RoomInput),
      image_url: values.image_url,
    };

    await upsertRoom(portalData, venueId, user, roomIndex);
    await updateVenueRoom();

    onEdit?.();
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
            <AdminSection title="Livestream URL" withLabel>
              <AdminInput
                name="iframeUrl"
                placeholder="Livestream URL"
                register={register}
                errors={errors}
              />
            </AdminSection>
            <AdminSection>
              <Checkbox
                name="autoPlay"
                defaultChecked={values.autoPlay}
                forwardedRef={register}
                containerClassName="SpaceEditFormNG__toggler"
                label="Autoplay"
              />
            </AdminSection>
          </>
        </AdminSpacesListItem>
        <AdminSpacesListItem title="Appearance" isOpened>
          <AdminSection title="Upload a banner photo">
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
          <AdminSection title="Upload a logo">
            <ImageInput
              nameWithUnderscore
              onChange={changePortalImageUrl}
              name="image"
              imgUrl={values.image_url}
              error={errors.image_url}
              setValue={setValue}
              register={register}
              small
            />
          </AdminSection>
        </AdminSpacesListItem>
        <AdminSpacesListItem title="Extras" isOpened>
          <AdminSection>
            <Checkbox
              defaultChecked={values.showShoutouts}
              forwardedRef={register}
              containerClassName="SpaceEditFormNG__toggler"
              label="Enable shoutouts"
              name="showShoutouts"
            />
          </AdminSection>
          <AdminSection>
            <Checkbox
              defaultChecked={values.showReactions}
              forwardedRef={register}
              containerClassName="SpaceEditFormNG__toggler"
              label="Reaction emojis"
              name="showReactions"
            />
          </AdminSection>
          <AdminSection>
            <Toggler
              name="isReactionsMuted"
              forwardedRef={register}
              disabled={!values.showReactions}
              containerClassName="SpaceEditFormNG__toggler"
              label="Audible"
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
            disabled={isUpdating || isDeleting}
          >
            Save changes
          </ButtonNG>
        </AdminSidebarFooter>
      </Form>
    </div>
  );
};
