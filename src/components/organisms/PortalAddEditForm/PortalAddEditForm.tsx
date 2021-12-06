import React, { useCallback, useEffect, useMemo } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useAsyncFn } from "react-use";

import {
  DEFAULT_PORTAL_INPUT,
  DEFAULT_VENUE_LOGO,
  PortalInfoListItem,
  ROOM_TAXON,
  SPACE_TAXON,
} from "settings";

import { createRoom, upsertRoom } from "api/admin";

import { PortalInput, Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/venues";

import { isTruthy } from "utils/types";

import { roomSchema } from "forms/roomSchema";

import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useUser } from "hooks/useUser";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { AdminInput } from "components/molecules/AdminInput";
import { AdminSection } from "components/molecules/AdminSection";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Checkbox } from "components/atoms/Checkbox";
import ImageInput from "components/atoms/ImageInput";
import { PortalVisibility } from "components/atoms/PortalVisibility";
import { SpacesDropdown } from "components/atoms/SpacesDropdown";

import { AdminVenueViewRouteParams } from "../AdminVenueView/AdminVenueView";

import "./PortalAddEditForm.scss";

export interface PortalAddEditFormProps {
  item?: PortalInfoListItem;
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
  const { worldSlug, spaceSlug } = useParams<AdminVenueViewRouteParams>();
  const { spaceId: currentSpaceId, world } = useWorldAndSpaceBySlug(
    worldSlug,
    spaceSlug
  );

  const { icon } = item ?? {};

  const isEditMode = isTruthy(portal);
  const title = isEditMode ? "Edit the portal" : "Create a portal";

  const defaultValues = useMemo(
    () => ({
      title: portal?.title ?? "",
      image_url: portal?.image_url ?? icon ?? DEFAULT_VENUE_LOGO,
      visibility: portal?.visibility ?? venueVisibility,
      spaceId: portal?.spaceId ?? undefined,
      isClickable: portal?.type !== RoomType.unclickable,
      isEnabled: portal?.isEnabled ?? true,
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
    ]
  );

  const {
    register,
    getValues,
    handleSubmit,
    errors,
    setValue,
    reset,
  } = useForm({
    reValidateMode: "onChange",

    validationSchema: roomSchema,
    defaultValues,
  });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const changeRoomImageUrl = useCallback(
    (val: string) => {
      setValue("image_url", val, false);
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
      isClickable,
      isEnabled,
    } = getValues();

    const portalSource = portal ?? {};

    const portalData: PortalInput = {
      ...DEFAULT_PORTAL_INPUT,
      ...portalSource,
      title,
      image_url,
      visibility,
      spaceId,
      type: !isClickable ? RoomType.unclickable : undefined,
      isEnabled,
    };

    if (portal) {
      await upsertRoom(portalData, currentSpaceId, user, portalIndex);
    } else {
      await createRoom(portalData, currentSpaceId, user);
    }

    await onDone();
  }, [currentSpaceId, getValues, onDone, portal, portalIndex, user, world]);

  const { ownedVenues } = useOwnedVenues({});

  const backButtonOptionList = useMemo(
    () =>
      Object.fromEntries(
        ownedVenues
          .filter(
            ({ worldId: venueWorldId, id }) =>
              !(venueWorldId !== world?.id || id === currentSpaceId)
          )
          .map((venue) => [venue.id, venue])
      ),
    [currentSpaceId, ownedVenues, world?.id]
  );

  // const [isOverrideAppearanceEnabled, setOverridenAppearance] = useState(false);

  const isOverrideAppearanceEnabled = true;
  return (
    <Form
      className="PortalAddEditForm__form"
      onSubmit={handleSubmit(addPortal)}
    >
      <div className="PortalAddEditForm__title">{title}</div>
      <AdminInput
        name="title"
        type="text"
        autoComplete="off"
        placeholder={`${SPACE_TAXON.capital} name`}
        label="Name (required)"
        errors={errors}
        register={register}
        disabled={isLoading}
      />

      <AdminSection title="Which space should we open to?" withLabel>
        <SpacesDropdown
          spaces={backButtonOptionList}
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
          // checked={isOverrideAppearanceEnabled}
          // onChange={() => setOverridenAppearance(!isOverrideAppearanceEnabled)}
          name="isAppearanceOverriden"
          label="Override appearance"
        />

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
            name="isEnabled"
            register={register}
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
      </AdminSection>

      <SubmitError error={submitError} />
      <div className="PortalAddEditForm__buttons">
        <ButtonNG
          variant="primary"
          disabled={isLoading}
          title={title}
          type="submit"
        >
          Save
        </ButtonNG>
      </div>
    </Form>
  );
};
