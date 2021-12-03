import React from "react";
import { Modal } from "react-bootstrap";

import { PortalInfoListItem } from "settings";

import { PortalAddForm } from "components/organisms/PortalAddForm";

import "./PortalAddModal.scss";

export type PortalAddModalProps = {
  item: PortalInfoListItem;
  show: boolean;
  onHide: () => void;
};

export const PortalAddModal: React.FC<PortalAddModalProps> = ({
  item,
  onHide,
  show,
}) => (
  <Modal className="PortalAddModal" show={show} onHide={onHide} centered>
    <Modal.Body>
      <PortalAddForm item={item} onDone={onHide} />
    </Modal.Body>
  </Modal>
);
