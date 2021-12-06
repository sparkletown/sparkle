import React, { useCallback, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
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

import { useUser } from "hooks/useUser";

import { PrettyLink } from "components/organisms/AdminVenueView/components/PrettyLink";

import { AdminCheckbox } from "components/molecules/AdminCheckbox";
import { FormErrors } from "components/molecules/FormErrors";
import { Loading } from "components/molecules/Loading";
import { SubmitError } from "components/molecules/SubmitError";

import { PortalIcon } from "components/atoms/PortalIcon";

import "./PortalStripForm.scss";

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
  const { image_url: iconUrl, template, title, url } = portal;

  const { user } = useUser();
  const [updatingClickable, setUpdatingClickable] = useState(false);
  const [updatingEnabled, setUpdatingEnabled] = useState(false);

  const { getValues, register, reset, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      isClickable: convertPortalTypeToClickability(portal?.type),
      isEnabled: portal?.isEnabled ?? DEFAULT_PORTAL_IS_ENABLED,
    },
  });

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

  return (
    <Form className="PortalStripForm">
      <div className="PortalStripForm__cell PortalStripForm__icon">
        <PortalIcon src={iconUrl} />
      </div>
      <div className="PortalStripForm__cell PortalStripForm__info">
        <div className="PortalStripForm__title">{title}</div>
        <div className="PortalStripForm__type">{template}</div>
        <div className="PortalStripForm__link">
          <PrettyLink to={url} title={url} />
        </div>
      </div>
      <div
        className="PortalStripForm__cell PortalStripForm__visibility"
        tabIndex={0}
      >
        <AdminCheckbox
          variant="toggler"
          name="isClickable"
          register={register}
          label={renderedClickableLabel}
          labelPosition="after"
          onClick={handleClickable}
        />
      </div>
      <div className="PortalStripForm__cell PortalStripForm__clickability">
        <AdminCheckbox
          variant="toggler"
          name="isEnabled"
          register={register}
          label={renderedEnabledLabel}
          labelPosition="after"
          onClick={handleEnabled}
          tabIndex={0}
        />
      </div>
      <div className="PortalStripForm__cell PortalStripForm__edit">
        <PrettyLink>
          <FontAwesomeIcon icon={faPen} />
          <span className="PortalStripForm__edit-text">Edit</span>
        </PrettyLink>
      </div>
      <FormErrors errors={errors} />
      <SubmitError error={submitError} />
    </Form>
  );
};
