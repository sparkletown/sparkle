import React, { useCallback, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Bugsnag from "@bugsnag/js";

import { createUrlSafeName, createVenue_v2 } from "api/admin";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { venueLandingUrl } from "utils/url";

import { VenueTemplate } from "types/venues";

import { newVenueSchema } from "pages/Admin/Details/ValidationSchema";

import "./CreateVenueModal.scss";

interface CreateVenueModalProps {
  isVisible: boolean;
  onHide?: () => void;
}

export interface FormValues {
  name: string;
}

export const CreateVenueModal: React.FC<CreateVenueModalProps> = ({
  isVisible,
  onHide,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const venueId = useVenueId();
  const { user } = useUser();

  const hide = useCallback(() => {
    onHide && onHide();
  }, [onHide]);

  const onSubmit = useCallback(
    async (vals: FormValues) => {
      if (!user || isLoading) return;
      setLoading(true);

      const venue = {
        name: vals.name,
        template: VenueTemplate.partymap,
      };

      createVenue_v2(venue, user)
        .then(() => {
          hide();
        })
        .catch((e) => {
          Bugsnag.notify(e, (event) => {
            event.addMetadata("CreateVenueModal::createVenue_v2", {
              venueName: vals.name,
            });
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [hide, isLoading, user]
  );

  const { watch, register, errors, handleSubmit } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    validationSchema: newVenueSchema,
    validationContext: {
      editing: !!venueId,
    },
  });

  const values = watch();

  const urlSafeName = values.name
    ? `${window.location.host}${venueLandingUrl(
        createUrlSafeName(values.name)
      )}`
    : undefined;

  return (
    <Modal
      show={isVisible}
      onHide={hide}
      centered
      backdropClassName="modal-backdrop in"
    >
      <Modal.Body className="create-venue-modal modal-content in">
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="create-venue-modal__content"
        >
          <div className="create-venue-modal__title">Name your new space</div>
          <Form.Control
            name="name"
            placeholder="Enter the name of your new space"
            ref={register}
            custom
            disabled={isLoading}
          />
          {errors.name && (
            <span className="input-error">{errors.name.message}</span>
          )}
          <div className="create-venue-modal__url-info">
            The url of your party will be:{" "}
            <span className="create-venue-modal__url">{urlSafeName}</span>
          </div>
          <div className="create-venue-modal__buttons">
            <button
              className="create-venue-modal__buttons--back"
              onClick={hide}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="create-venue-modal__buttons--next"
              type="submit"
              disabled={isLoading}
            >
              Next
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
