import React from "react";

import { PortalInfoItem } from "settings";

import { Room } from "types/rooms";

import { PortalAddEditForm } from "components/organisms/PortalAddEditForm";

import { Modal } from "components/molecules/Modal";

import "./PortalAddEditModal.scss";

export type PortalAddEditModalProps = {
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
  <Modal isOpen={show} onClose={onHide}>
    <PortalAddEditForm
      item={item}
      onDone={onHide}
      portal={portal}
      portalIndex={portalIndex}
    />
  </Modal>
);
