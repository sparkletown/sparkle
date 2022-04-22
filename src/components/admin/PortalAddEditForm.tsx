import React, { useCallback, useEffect, useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn, useToggle } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/admin/Button";
import { ConfirmationModal } from "components/admin/ConfirmationModal/ConfirmationModal";
import { ImageInput } from "components/admin/ImageInput";
import { Input } from "components/admin/Input";
import { PortalVisibility } from "components/admin/PortalVisibility";
import { SpacesDropdown } from "components/admin/SpacesDropdown";
import { Toggle } from "components/admin/Toggle";

import {
  DEFAULT_PORTAL_INPUT,
  DEFAULT_PORTAL_IS_CLICKABLE,
  DEFAULT_PORTAL_IS_ENABLED,
  DEFAULT_VENUE_LOGO,
  PORTAL_INFO_ICON_MAPPING,
  PortalInfoItem,
  SPACE_TAXON,
} from "settings";

import { createRoom, deletePortal, upsertRoom } from "api/admin";

import { SpaceId } from "types/id";
import { PortalInput, Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";

import { isTruthy } from "utils/types";

import { roomSchema } from "forms/roomSchema";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useLiveUser } from "hooks/user/useLiveUser";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";

import { AdminSection } from "components/molecules/AdminSection";
import { SubmitError } from "components/molecules/SubmitError";

const DEFAULT_SIZE_PERCENT = 5;

interface determineNewWidthAndHeightOptions {
  portal?: Room;
  newWidthPx: number;
  newHeightPx: number;
  mapWidthPx: number;
  mapHeightPx: number;
}

const determineNewWidthAndHeight = ({
  portal,
  newWidthPx,
  newHeightPx,
  mapWidthPx,
  mapHeightPx,
}: determineNewWidthAndHeightOptions) => {
  const newRatio = newHeightPx / newWidthPx;

  // Fix the largest axis and change the other
  if (!portal) {
    return [DEFAULT_SIZE_PERCENT, DEFAULT_SIZE_PERCENT];
  }
  const existingWidthPx = (portal.width_percent * mapWidthPx) / 100;
  const existingHeightPx = (portal.height_percent * mapHeightPx) / 100;
  if (existingWidthPx > existingHeightPx) {
    return [
      portal.width_percent,
      (100 * existingWidthPx * newRatio) / mapHeightPx,
    ];
  } else {
    return [
      (100 * existingHeightPx) / newRatio / mapWidthPx,
      portal.height_percent,
    ];
  }
};

interface PortalAddEditFormProps {
  item?: PortalInfoItem;
  onDone: () => void;
  portal?: Room;
  venueVisibility?: RoomVisibility;
  portalIndex?: number;
  mapWidthPx: number;
  mapHeightPx: number;
}

export const PortalAddEditForm: React.FC<PortalAddEditFormProps> = ({
  portal,
  item,
  onDone,
  venueVisibility,
  portalIndex,
  mapWidthPx,
  mapHeightPx,
}) => {
  const { user } = useLiveUser();
  const { spaceId: currentSpaceId, world, space } = useWorldAndSpaceByParams();
  const {
    isShown: isPortalDeleteShown,
    show: showPortalDelete,
    hide: hidePortalDelete,
  } = useShowHide();

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
      isClickable: portal?.type !== RoomType.unclickable,
      isEnabled: portal?.isEnabled ?? DEFAULT_PORTAL_IS_ENABLED,
      // @debt should use SpaceId type here, resolve error with form typing
      spaceId: (portal?.spaceId as string) ?? undefined,
      width_percent: portal?.width_percent,
      height_percent: portal?.height_percent,
    }),
    [
      portal?.title,
      portal?.image_url,
      portal?.visibility,
      portal?.type,
      portal?.isEnabled,
      portal?.spaceId,
      portal?.width_percent,
      portal?.height_percent,
      icon,
      spaceLogoImage,
      venueVisibility,
    ]
  );

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    reValidateMode: "onChange",
    resolver: yupResolver(roomSchema),
    defaultValues,
  });

  const values = watch();

  const { errors } = useFormState({ control });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const changeRoomImageUrl = useCallback(
    ({ url }) => {
      setValue("image_url", url, { shouldValidate: false });

      // Get the new image and use it to calculate new width/height for the
      // image so that the aspect ratio isn't wrong.
      const checkImage = new Image();
      checkImage.src = url;
      checkImage.decode().then(() => {
        const [newWidth, newHeight] = determineNewWidthAndHeight({
          portal,
          newWidthPx: checkImage.naturalWidth,
          newHeightPx: checkImage.naturalHeight,
          mapWidthPx,
          mapHeightPx,
        });
        setValue("width_percent", newWidth);
        setValue("height_percent", newHeight);
      });
    },
    [mapHeightPx, mapWidthPx, portal, setValue]
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
      width_percent,
      height_percent,
    } = getValues();

    const portalSource = portal ?? {};

    const portalData: PortalInput = {
      ...DEFAULT_PORTAL_INPUT,
      ...portalSource,
      title,
      image_url,
      image_file,
      visibility,
      spaceId: spaceId as SpaceId,
      type: !isClickable ? RoomType.unclickable : undefined,
      isEnabled,
    };
    if (width_percent) {
      portalData.width_percent = width_percent;
    }
    if (height_percent) {
      portalData.height_percent = height_percent;
    }

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
    removePortal,
  ] = useAsyncFn(async () => {
    if (!currentSpaceId || !portal) return;

    await deletePortal(currentSpaceId, portal);
    await onDone();
  }, [currentSpaceId, onDone, portal]);

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

  const createLabel = isLoading ? "Creating..." : "Create";
  const saveLabel = isLoading ? "Saving..." : "Save";

  return (
    <div data-bem="PortalAddEditForm">
      <form className="bg-white" onSubmit={handleSubmit(addPortal)}>
        <div className="text-lg leading-6 font-medium text-gray-900 mb-6">
          {title}
        </div>
        <SpacesDropdown
          spaces={backButtonOptionList}
          parentSpace={parentSpace}
          setValue={setValue}
          register={register}
          fieldName="spaceId"
          error={errors?.spaceId}
        />
        <Input
          type="text"
          autoComplete="off"
          placeholder={`${SPACE_TAXON.capital} name`}
          errors={errors}
          name="title"
          register={register}
          disabled={isLoading}
          label="Name"
        />
        <AdminSection>
          {/* @debt: Create AdminImageInput to wrap ImageInput with error handling and labels */}
          {/* ie. PortalVisibility/AdminInput */}
          <ImageInput
            onChange={changeRoomImageUrl}
            name="image"
            setValue={setValue}
            register={register}
            nameWithUnderscore
            imgUrl={portal?.image_url ?? icon}
            error={errors?.image_url}
            inputLabel="Highlight image"
            buttonLabel="Change highlight image"
          />
        </AdminSection>
        <AdminSection>
          <Toggle
            checked={isOverrideAppearanceEnabled}
            onChange={toggleOverrideAppearance}
            label="Override appearance"
            title="Change label appearance (overrides general)"
          />
        </AdminSection>
        <PortalVisibility
          getValues={getValues}
          name="visibility"
          register={register}
          setValue={setValue}
        />
        <Toggle
          register={register}
          checked={values.isEnabled}
          name="isEnabled"
          label="Portal is visible"
        />
        <Toggle
          name="isClickable"
          register={register}
          checked={values.isClickable}
          label="Portal is clickable"
        />
        <SubmitError error={submitError || deleteError} />
        <div className="mt-5 sm:mt-4 sm:flex justify-end">
          {isEditMode && (
            <div className="mr-auto">
              <Button
                variant="danger"
                disabled={isLoading || isDeleting}
                onClick={showPortalDelete}
              >
                Delete
              </Button>
            </div>
          )}
          <Button
            variant="secondary"
            disabled={isLoading || isDeleting}
            onClick={onDone}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={isLoading || isDeleting}
            disabled={isLoading || isDeleting}
            title={title}
            type="submit"
          >
            {portal ? saveLabel : createLabel}
          </Button>
        </div>
      </form>
      {isPortalDeleteShown && (
        <ConfirmationModal
          header="Delete portal"
          message="Are you sure you want to delete this portal?"
          onConfirm={removePortal}
          onCancel={hidePortalDelete}
          confirmVariant="danger"
        />
      )}
    </div>
  );
};
