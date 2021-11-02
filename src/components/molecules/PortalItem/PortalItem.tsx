import React from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import classNames from "classnames";

import { ROOM_TAXON, SPACE_TAXON, SpacePortalsListItem } from "settings";

import {
  createRoom,
  createSlug,
  createVenue_v2,
  RoomInput_v2,
} from "api/admin";

import { venueInsideFullUrl } from "utils/url";
import { buildEmptyVenue } from "utils/venue";

import { useCheckImage } from "hooks/useCheckImage";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import {
  createPortalSchema,
  createSpaceSchema,
} from "pages/Admin/Details/ValidationSchema";

import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";

import "./PortalItem.scss";

export interface PortalItemProps {
  item: SpacePortalsListItem;
  worldId: string;
  tabIndex?: number;
}

export const PortalItem: React.FC<PortalItemProps> = ({
  item,
  worldId,
  tabIndex,
}) => {
  const { icon, text, poster, description, template, hidden } = item;
  const {
    isShown: isModalVisible,
    show: showModal,
    hide: hideModal,
  } = useShowHide();

  const { user } = useUser();

  const venueId = useVenueId();

  const { register, getValues, handleSubmit, errors } = useForm({
    validationSchema:
      template === "external" ? createPortalSchema : createSpaceSchema,
    defaultValues: {
      roomTitle: "",
      roomUrl: "",
      venueName: "",
      template: template,
    },
  });

  const [
    { loading: isLoading, error: submitError },
    addRoom,
  ] = useAsyncFn(async () => {
    if (!user || !venueId || !template) return;

    const { roomUrl, venueName } = getValues();

    const slug = createSlug(venueName);
    const url = template === "external" ? roomUrl : venueInsideFullUrl(slug);

    const roomData: RoomInput_v2 = {
      title: venueName,
      about: "",
      isEnabled: true,
      image_url: icon,
      url,
      width_percent: 5,
      height_percent: 5,
      x_percent: 50,
      y_percent: 50,
      template,
    };

    if (template !== "external") {
      const venueData = buildEmptyVenue(venueName, template);
      await createVenue_v2({ ...venueData, worldId, parentId: venueId }, user);
    }

    await createRoom(roomData, venueId, user);
    await hideModal();
  }, [getValues, hideModal, icon, template, user, venueId, worldId]);

  const { isValid } = useCheckImage(poster);

  const portalItemClasses = classNames({
    [`PortalItem PortalItem--${template}`]: true,
    "mod--hidden": hidden,
  });

  return (
    <div className={portalItemClasses}>
      <Modal
        className="PortalItem__modal"
        show={isModalVisible}
        onHide={hideModal}
        centered
      >
        <Modal.Body>
          <Form className="PortalItem__form" onSubmit={handleSubmit(addRoom)}>
            <div className="PortalItem__title">{text}</div>
            {isValid && (
              <img
                className="PortalItem__poster"
                alt={`${text} representation`}
                src={poster}
              />
            )}
            <div className="PortalItem__description">{description}</div>
            <InputField
              name="venueName"
              type="text"
              autoComplete="off"
              placeholder={`${SPACE_TAXON.capital} name`}
              error={errors.venueName}
              ref={register()}
              disabled={isLoading}
            />
            {template === "external" && (
              <InputField
                name="roomUrl"
                type="text"
                autoComplete="off"
                placeholder={`${SPACE_TAXON.capital} url`}
                error={errors.roomUrl}
                ref={register()}
                disabled={isLoading}
              />
            )}
            <SubmitError error={submitError} />
            <div className="PortalItem__modal-buttons">
              <ButtonNG
                variant="primary"
                disabled={isLoading}
                title={`Add ${ROOM_TAXON.lower}`}
                type="submit"
              >
                Add {ROOM_TAXON.lower}
              </ButtonNG>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {
        // NOTE: tabIndex allows tab behavior, @see https://allyjs.io/data-tables/focusable.html
      }
      <div
        className="PortalItem__list-item"
        onClick={showModal}
        tabIndex={tabIndex}
      >
        <img
          className="PortalItem__icon"
          alt={`${ROOM_TAXON.lower} icon ${icon}`}
          src={icon}
        />
        <div className="PortalItem__name">{text}</div>
      </div>
    </div>
  );
};
