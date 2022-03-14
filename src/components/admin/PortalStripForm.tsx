import React, { useCallback, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsync, useAsyncFn } from "react-use";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DEFAULT_PORTAL_IS_ENABLED, PORTAL_INFO_ICON_MAPPING } from "settings";

import { upsertRoom } from "api/admin";
import { fetchVenue } from "api/venue";

import { Room } from "types/rooms";

import {
  convertClickabilityToPortalType,
  convertPortalTypeToClickability,
} from "utils/portal";
import { isExternalPortal } from "utils/url";

import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { FormErrors } from "components/molecules/FormErrors";
import { Loading } from "components/molecules/Loading";
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
}

export const PortalStripForm: React.FC<PortalStripFormProps> = ({
  portal,
  index,
  spaceId,
}) => {
  const { image_url: iconUrl, title, spaceId: targetSpaceId } = portal;

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

  const { value: targetSpace } = useAsync(async () => {
    if (targetSpaceId) {
      return fetchVenue(targetSpaceId);
    }
  });

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

  return (
    <TablePanel.Row>
      <TablePanel.Cell>
        <PortalIcon src={portalIcon} />
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-900">
            Destination {targetSpace?.name || "no linked space"}
          </div>
        </div>
      </TablePanel.Cell>
      <TablePanel.ActionsCell>
        <div className="flex items-center -mb-5 flex-row">
          <div className="flex items-center mb-5">
            <Toggle
              name="isEnabled"
              label={renderedEnabledLabel}
              onChange={handleEnabled}
              checked={values.isEnabled}
            />
          </div>
        </div>
        <div className="flex items-center -mb-5 flex-row">
          <div className="flex items-center mb-5">
            <Toggle
              name="isClickable"
              label={renderedClickableLabel}
              onChange={handleClickable}
              checked={values.isClickable}
            />
          </div>
        </div>
        <div className="flex items-center flex-row" onClick={showModal}>
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
        />
      )}
    </TablePanel.Row>
  );
};
