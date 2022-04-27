import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DEFAULT_PORTAL_IS_ENABLED } from "settings";

import { upsertRoom } from "api/admin";

import { Room } from "types/rooms";

import {
  convertClickabilityToPortalType,
  convertPortalTypeToClickability,
} from "utils/portal";

import { useSpaceById } from "hooks/spaces/useSpaceById";
import { useLiveUser } from "hooks/user/useLiveUser";
import { useShowHide } from "hooks/useShowHide";

import { FormErrors } from "components/molecules/FormErrors";
import { PortalAddEditModal } from "components/molecules/PortalAddEditModal";
import { SubmitError } from "components/molecules/SubmitError";

import { PortalIcon } from "components/atoms/PortalIcon";

import { TablePanel } from "./TablePanel";
import { Toggle } from "./Toggle";

const FIELD_ENABLED = "isEnabled";
const FIELD_CLICKABLE = "isClickable";

interface PortalStripFormProps {
  portal: Room;
  index: number;
  spaceId: string;
  mapWidthPx: number;
  mapHeightPx: number;
}

export const PortalStripForm: React.FC<PortalStripFormProps> = ({
  portal,
  index,
  spaceId,
  mapWidthPx,
  mapHeightPx,
}) => {
  const { image_url: iconUrl, title, spaceId: targetSpaceId } = portal;
  const { user } = useLiveUser();
  const [updatingClickable, setUpdatingClickable] = useState(false);
  const [updatingEnabled, setUpdatingEnabled] = useState(false);
  const { space } = useSpaceById({ spaceId: targetSpaceId });
  const {
    isShown: isModalShown,
    hide: hideModal,
    show: showModal,
  } = useShowHide(false);

  const portalIcon = iconUrl;

  const { getValues, reset, control, handleSubmit } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      isClickable: convertPortalTypeToClickability(portal?.type),
      isEnabled: portal?.isEnabled ?? DEFAULT_PORTAL_IS_ENABLED,
    },
  });

  const { errors } = useFormState({ control });

  const values = getValues();

  useEffect(() => {
    reset({
      isClickable: convertPortalTypeToClickability(portal?.type),
      isEnabled: portal?.isEnabled ?? DEFAULT_PORTAL_IS_ENABLED,
    });
  }, [portal, reset]);

  const [{ loading, error: submitError }, submit] = useAsyncFn(
    async (field: typeof FIELD_ENABLED | typeof FIELD_CLICKABLE) => {
      if (!user) return;

      const isEnabled =
        field === FIELD_ENABLED ? !values.isEnabled : values.isEnabled;
      const isClickable =
        field === FIELD_CLICKABLE ? !values.isClickable : values.isClickable;

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
      const handler = handleSubmit(() => submit(FIELD_CLICKABLE));
      return handler(event);
    },
    [setUpdatingClickable, handleSubmit, submit]
  );

  const handleEnabled = useCallback(
    (event) => {
      setUpdatingEnabled(true);
      const handler = handleSubmit(() => submit(FIELD_ENABLED));
      return handler(event);
    },
    [setUpdatingEnabled, handleSubmit, submit]
  );

  const renderedClickableLabel = useMemo(
    () => (
      <span className="PortalStripForm__label">
        {loading && updatingClickable ? (
          <span>Updating...</span>
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
          <span>Updating...</span>
        ) : (
          <span>{values.isEnabled ? "Visible" : "Invisible"}</span>
        )}
      </span>
    ),
    [loading, updatingEnabled, values.isEnabled]
  );

  return (
    <TablePanel.Row>
      <TablePanel.Cell>
        <PortalIcon src={portalIcon} />
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-900">
            Destination {space?.name || "no linked space"}
          </div>
        </div>
      </TablePanel.Cell>
      <TablePanel.ActionsCell>
        <div className="flex items-center flex-row">
          <div className="flex items-center">
            <Toggle
              name="isEnabled"
              label={renderedEnabledLabel}
              onChange={handleEnabled}
              checked={values.isEnabled}
            />
          </div>
        </div>
        <div className="flex items-center flex-row">
          <div className="flex items-center">
            <Toggle
              name="isClickable"
              label={renderedClickableLabel}
              onChange={handleClickable}
              checked={values.isClickable}
            />
          </div>
        </div>
        <div
          className="flex items-end flex-row cursor-pointer"
          onClick={showModal}
        >
          <FontAwesomeIcon
            icon={faPen}
            className="flex-shrink-0 mr-1.5 h-5 w-5 text-black"
          />
          <span className="text-black text-sm hover:text-indigo-900">Edit</span>
        </div>
        <FormErrors errors={errors} />
        <SubmitError error={submitError} />
      </TablePanel.ActionsCell>
      {isModalShown && (
        <PortalAddEditModal
          portal={portal}
          show={true}
          onHide={hideModal}
          portalIndex={index}
          mapWidthPx={mapWidthPx}
          mapHeightPx={mapHeightPx}
        />
      )}
    </TablePanel.Row>
  );
};
