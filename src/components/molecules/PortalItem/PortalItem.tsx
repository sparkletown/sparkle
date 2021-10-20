import React from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import classNames from "classnames";

import { ROOM_TAXON, SPACE_TAXON, SpacePortalsListItem } from "settings";

import {
  createRoom,
  createUrlSafeName,
  createVenue_v2,
  RoomInput_v2,
} from "api/admin";

import { venueInsideUrl } from "utils/url";
import { buildEmptyVenue } from "utils/venue";

import { useCheckImage } from "hooks/useCheckImage";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { createSpaceSchema } from "pages/Admin/Details/ValidationSchema";

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
    validationSchema: createSpaceSchema,
    defaultValues: {
      roomTitle: "",
      roomUrl: "",
      venueName: "",
      template: template,
    },
  });

  const [{ loading: isLoading }, addRoom] = useAsyncFn(async () => {
    if (!user || !venueId || !template) return;

    const roomValues = getValues();

    const venueUrlName = createUrlSafeName(roomValues.venueName);

    // @debt instead of using window.origin here, link should be able to be derived by generatePath or similar in url.ts
    const roomUrl = window.origin + venueInsideUrl(venueUrlName);

    const roomData: RoomInput_v2 = {
      title: roomValues.venueName,
      about: "",
      isEnabled: true,
      image_url: icon,
      url: roomUrl,
      width_percent: 5,
      height_percent: 5,
      x_percent: 50,
      y_percent: 50,
      template,
    };

    const venueData = buildEmptyVenue(roomValues.venueName, template);

    await createVenue_v2({ ...venueData, worldId, parentId: venueId }, user);
    await createRoom(roomData, venueId, user);
    await hideModal();
  }, [getValues, hideModal, icon, template, user, venueId, worldId]);

  const { isValid } = useCheckImage(poster);

  const portalItemClasses = classNames({
    PortalItem: true,
    "mod--hidden": hidden,
  });

  // NOTE: tabIndex allows tab behavior https://allyjs.io/data-tables/focusable.html
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
              className="PortalItem__modal-input"
              name="venueName"
              type="text"
              autoComplete="off"
              placeholder={`${SPACE_TAXON.capital} name`}
              error={errors.venueName}
              ref={register()}
              disabled={isLoading}
            />

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
