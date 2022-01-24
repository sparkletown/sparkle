import React from "react";
import { Modal } from "react-bootstrap";

import { PortalInfoItem } from "settings";

import { Room } from "types/rooms";

import { PortalAddEditForm } from "components/organisms/PortalAddEditForm";

import "./PortalAddEditModal.scss";

type PortalAddEditModalProps = {
  item?: PortalInfoItem;
  show: boolean;
  onHide: () => void;
  portal?: Room;
  portalIndex?: number;
};

export const PortalAddEditModal: React.FC<PortalAddEditModalProps> = ({
  item,
  onHide,
  show,
  portal,
  portalIndex,
}) => (
  <Modal className="PortalAddEditModal" show={show} onHide={onHide} centered>
    <Modal.Body>
      <PortalAddEditForm
        item={item}
        onDone={onHide}
        portal={portal}
        portalIndex={portalIndex}
      />
    </Modal.Body>
  </Modal>
);
