import React, { useCallback, useEffect, useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn, useToggle } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  DEFAULT_PORTAL_INPUT,
  DEFAULT_PORTAL_IS_CLICKABLE,
  DEFAULT_PORTAL_IS_ENABLED,
  DEFAULT_VENUE_LOGO,
  PORTAL_INFO_ICON_MAPPING,
  PortalInfoItem,
  ROOM_TAXON,
  SPACE_TAXON,
} from "settings";

import { createRoom, deleteRoom, upsertRoom } from "api/admin";

import { PortalInput, Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";

import { isTruthy } from "utils/types";

import { roomSchema } from "forms/roomSchema";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Checkbox } from "components/atoms/Checkbox";
import { ImageInput } from "components/atoms/ImageInput";
import { PortalVisibility } from "components/atoms/PortalVisibility";
import { SpacesDropdown } from "components/atoms/SpacesDropdown";

import "./PortalAddEditForm.scss";

interface PortalAddEditFormProps {
  item?: PortalInfoItem;
  onDone: () => void;
  portal?: Room;
  venueVisibility?: RoomVisibility;
  portalIndex?: number;
}

export const PortalAddEditForm: React.FC<PortalAddEditFormProps> = ({
  portal,
  item,
  onDone,
  venueVisibility,
  portalIndex,
}) => {
  const { user } = useUser();
  const { spaceId: currentSpaceId, world, space } = useWorldAndSpaceByParams();

  const { icon } = item ?? {};
  const spaceLogoImage =
    PORTAL_INFO_ICON_MAPPING[space?.template ?? ""] ?? DEFAULT_VENUE_LOGO;
  const isEditMode = isTruthy(portal);
  const title = isEditMode ? "Edit the portal" : "Create a portal";

  const defaultValues = useMemo(
    () => ({
      title: portal?.title ?? "",
      image_url: portal?.image_url ?? icon ?? spaceLogoImage,
      visibility: portal?.visibility ?? venueVisibility,
      spaceId: portal?.spaceId ?? undefined,
      isClickable: portal?.type !== RoomType.unclickable,
      isEnabled: portal?.isEnabled ?? DEFAULT_PORTAL_IS_ENABLED,
    }),
    [
      portal?.title,
      portal?.image_url,
      portal?.visibility,
      portal?.spaceId,
      portal?.type,
      portal?.isEnabled,
      icon,
      venueVisibility,
      spaceLogoImage,
    ]
  );

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm({
    reValidateMode: "onChange",
    resolver: yupResolver(roomSchema),
    defaultValues,
  });

  const { errors } = useFormState({ control });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const changeRoomImageUrl = useCallback(
    (val: string) => {
      setValue("image_url", val, { shouldValidate: false });
    },
    [setValue]
  );

  const [
    { loading: isLoading, error: submitError },
    addPortal,
  ] = useAsyncFn(async () => {
    if (!user || !world || !currentSpaceId) return;

    const {
      title,
      image_url,
      visibility,
      spaceId,
      isClickable = DEFAULT_PORTAL_IS_CLICKABLE,
      isEnabled = DEFAULT_PORTAL_IS_ENABLED,
      // @debt this needs resolving properly
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      image_file,
    } = getValues();

    const portalSource = portal ?? {};

    const portalData: PortalInput = {
      ...DEFAULT_PORTAL_INPUT,
      ...portalSource,
      title,
      image_url,
      image_file,
      visibility,
      spaceId,
      type: !isClickable ? RoomType.unclickable : undefined,
      isEnabled,
    };

    if (isEditMode) {
      await upsertRoom(portalData, currentSpaceId, user, portalIndex);
    } else {
      await createRoom(portalData, currentSpaceId, user);
    }

    await onDone();
  }, [
    currentSpaceId,
    getValues,
    isEditMode,
    onDone,
    portal,
    portalIndex,
    user,
    world,
  ]);

  const [
    { loading: isDeleting, error: deleteError },
    deletePortal,
  ] = useAsyncFn(async () => {
    if (!currentSpaceId || !portal) return;

    await deleteRoom(currentSpaceId, portal);
    await onDone();
  });

  const { relatedVenues } = useRelatedVenues();

  const backButtonOptionList = useMemo(
    () =>
      Object.fromEntries(
        relatedVenues
          .filter(({ id }) => id !== currentSpaceId)
          .map((venue) => [venue.id, venue])
      ),
    [currentSpaceId, relatedVenues]
  );

  const isAppearanceOverridenInPortal =
    !!portal &&
    isTruthy(
      portal.visibility ||
        portal.type === RoomType.unclickable ||
        !portal.isEnabled
    );

  const [isOverrideAppearanceEnabled, toggleOverrideAppearance] = useToggle(
    isAppearanceOverridenInPortal
  );

  const parentSpace = useMemo(
    () =>
      portal?.spaceId
        ? relatedVenues.find(({ id }) => id === portal?.spaceId)
        : { name: "" },
    [relatedVenues, portal?.spaceId]
  );

  return (
    <form
      className="PortalAddEditForm__form"
      onSubmit={handleSubmit(addPortal)}
    >
      <div className="PortalAddEditForm__title">{title}</div>
      <AdminInput
        type="text"
        autoComplete="off"
        placeholder={`${SPACE_TAXON.capital} name`}
        label="Name (required)"
        errors={errors}
        name="title"
        register={register}
        disabled={isLoading}
      />

      <AdminSection title="Which space should we open to?" withLabel>
        <SpacesDropdown
          spaces={backButtonOptionList}
          parentSpace={parentSpace}
          setValue={setValue}
          register={register}
          fieldName="spaceId"
          error={errors?.spaceId}
        />
      </AdminSection>

      <AdminSection
        withLabel
        title={`${ROOM_TAXON.capital} image`}
        subtitle="(overrides global settings)"
      >
        {/* @debt: Create AdminImageInput to wrap ImageInput with error handling and labels */}
        {/* ie. PortalVisibility/AdminInput */}
        <ImageInput
          onChange={changeRoomImageUrl}
          name="image"
          setValue={setValue}
          register={register}
          small
          nameWithUnderscore
          imgUrl={portal?.image_url ?? icon}
          error={errors?.image_url}
        />
      </AdminSection>
      <AdminSection
        withLabel
        title="Change label appearance"
        subtitle="(overrides general)"
      >
        <Checkbox
          toggler
          checked={isOverrideAppearanceEnabled}
          onChange={toggleOverrideAppearance}
          name="isAppearanceOverriden"
          label="Override appearance"
        />
      </AdminSection>

      {isOverrideAppearanceEnabled && (
        <PortalVisibility
          getValues={getValues}
          name="visibility"
          register={register}
          setValue={setValue}
        />
      )}

      {isOverrideAppearanceEnabled && (
        <AdminCheckbox
          register={register}
          name="isEnabled"
          variant="toggler"
          label="Portal is visible"
        />
      )}

      {isOverrideAppearanceEnabled && (
        <AdminCheckbox
          name="isClickable"
          register={register}
          variant="toggler"
          label="Portal is clickable"
        />
      )}

      <SubmitError error={submitError || deleteError} />
      <div className="PortalAddEditForm__buttons">
        {isEditMode && (
          <ButtonNG
            variant="danger"
            disabled={isLoading || isDeleting}
            onClick={deletePortal}
          >
            Delete
          </ButtonNG>
        )}
        <ButtonNG
          variant="primary"
          disabled={isLoading || isDeleting}
          title={title}
          type="submit"
        >
          Save
        </ButtonNG>
      </div>
    </form>
  );
};
