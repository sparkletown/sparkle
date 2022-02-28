import React, { useCallback, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsync, useAsyncFn } from "react-use";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox } from "components/admin/Checkbox";

import { DEFAULT_PORTAL_IS_ENABLED, PORTAL_INFO_ICON_MAPPING } from "settings";

import { upsertRoom } from "api/admin";
import { fetchVenue } from "api/venue";

import { WorldSlug } from "types/id";
import { Room } from "types/rooms";
import { AnyVenue } from "types/venues";

import {
  convertClickabilityToPortalType,
  convertPortalTypeToClickability,
} from "utils/portal";
import { generateAttendeeInsideUrl, isExternalPortal } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { PrettyLink } from "components/organisms/AdminVenueView/components/PrettyLink";

import { FormErrors } from "components/molecules/FormErrors";
import { Loading } from "components/molecules/Loading";
import { PortalAddEditModal } from "components/molecules/PortalAddEditModal";
import { SubmitError } from "components/molecules/SubmitError";

import { PortalIcon } from "components/atoms/PortalIcon";

type generateTargetUrlOptions = {
  worldSlug: WorldSlug;
  targetSpace?: AnyVenue;
  portal: Room;
};

const generateTargetUrl = ({
  worldSlug,
  portal,
  targetSpace,
}: generateTargetUrlOptions) => {
  if (targetSpace) {
    return generateAttendeeInsideUrl({
      worldSlug,
      spaceSlug: targetSpace.slug,
    });
  } else {
    return portal.url;
  }
};

interface PortalStripFormProps {
  portal: Room;
  index: number;
  spaceId: string;
}

export const PortalStripForm: React.FC<PortalStripFormProps> = ({
  portal,
  index,
  spaceId,
}) => {
  const {
    image_url: iconUrl,
    template,
    title,
    spaceId: targetSpaceId,
  } = portal;

  const { worldSlug } = useSpaceParams();
  const { user } = useUser();
  const [updatingClickable, setUpdatingClickable] = useState(false);
  const [updatingEnabled, setUpdatingEnabled] = useState(false);
  const {
    isShown: isModalShown,
    hide: hideModal,
    show: showModal,
  } = useShowHide(false);

  const portalIcon = isExternalPortal(portal)
    ? PORTAL_INFO_ICON_MAPPING["external"]
    : iconUrl;

  const { value: targetSpace, loading: isSpaceLoading } = useAsync(async () => {
    if (targetSpaceId) {
      return fetchVenue(targetSpaceId);
    }
  });

  const { getValues, register, reset, control, handleSubmit } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      isClickable: convertPortalTypeToClickability(portal?.type),
      isEnabled: portal?.isEnabled ?? DEFAULT_PORTAL_IS_ENABLED,
    },
  });

  const { errors } = useFormState({ control });

  const values = getValues();

  const [{ loading, error: submitError }, submit] = useAsyncFn(
    async (field: string, _) => {
      if (!user) return;

      const isEnabled =
        field === "isEnabled" ? !values.isEnabled : values.isEnabled;
      const isClickable =
        field === "isClickable" ? !values.isClickable : values.isClickable;

      const type = convertClickabilityToPortalType(isClickable);

      await upsertRoom(
        { ...portal, isEnabled, type },
        spaceId,
        user,
        index
      ).finally(() => {
        setUpdatingClickable(false);
        setUpdatingEnabled(false);
      });

      reset({ isEnabled, isClickable });
    },
    [index, portal, user, spaceId, reset, values.isEnabled, values.isClickable]
  );

  const handleClickable = useCallback(
    (event) => {
      setUpdatingClickable(true);
      const handler = handleSubmit((data) => submit("isClickable", data));
      return handler(event);
    },
    [setUpdatingClickable, handleSubmit, submit]
  );

  const handleEnabled = useCallback(
    (event) => {
      setUpdatingEnabled(true);
      const handler = handleSubmit((data) => submit("isEnabled", data));
      return handler(event);
    },
    [setUpdatingEnabled, handleSubmit, submit]
  );

  const renderedClickableLabel = useMemo(
    () => (
      <span className="PortalStripForm__label">
        {loading && updatingClickable ? (
          <Loading label="Updating..." />
        ) : (
          <span>{values.isClickable ? "Clickable" : "Unclickable"}</span>
        )}
      </span>
    ),
    [loading, updatingClickable, values.isClickable]
  );

  const renderedEnabledLabel = useMemo(
    () => (
      <span className="PortalStripForm__label">
        {loading && updatingEnabled ? (
          <Loading label="Updating..." />
        ) : (
          <span>{values.isEnabled ? "Visible" : "Invisible"}</span>
        )}
      </span>
    ),
    [loading, updatingEnabled, values.isEnabled]
  );

  const targetUrl = !isSpaceLoading
    ? generateTargetUrl({ worldSlug, portal, targetSpace })
    : "";

  return (
    <>
      <form className="PortalStripForm">
        <div className="PortalStripForm__cell PortalStripForm__icon">
          <PortalIcon src={portalIcon} />
        </div>
        <div className="PortalStripForm__cell PortalStripForm__info">
          <div className="PortalStripForm__title">{title}</div>
          <div className="PortalStripForm__type">{template}</div>
          <div className="PortalStripForm__link">
            {!isSpaceLoading && <PrettyLink to={targetUrl} title={targetUrl} />}
          </div>
        </div>
        <div className="PortalStripForm__cell PortalStripForm__visibility">
          <Checkbox
            variant="toggler"
            name="isClickable"
            register={register}
            label={renderedClickableLabel}
            onClick={handleClickable}
          />
        </div>
        <div className="PortalStripForm__cell PortalStripForm__clickability">
          <Checkbox
            variant="toggler"
            name="isEnabled"
            register={register}
            label={renderedEnabledLabel}
            onClick={handleEnabled}
          />
        </div>
        <div
          className="PortalStripForm__cell PortalStripForm__edit"
          onClick={showModal}
        >
          <PrettyLink>
            <FontAwesomeIcon icon={faPen} />
            <span className="PortalStripForm__edit-text">Edit</span>
          </PrettyLink>
        </div>
        <FormErrors errors={errors} />
        <SubmitError error={submitError} />
      </form>
      {isModalShown && (
        <PortalAddEditModal
          portal={portal}
          show={true}
          onHide={hideModal}
          portalIndex={index}
        />
      )}
    </>
  );
};
