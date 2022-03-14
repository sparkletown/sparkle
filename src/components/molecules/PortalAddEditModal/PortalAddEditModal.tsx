import React from "react";
import { PortalAddEditForm } from "components/admin/PortalAddEditForm";

import { PortalInfoItem } from "settings";

import { Room } from "types/rooms";

import { Modal } from "components/molecules/Modal";

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
  <Modal show={show} onHide={onHide} autoHide>
    <PortalAddEditForm
      item={item}
      onDone={onHide}
      portal={portal}
      portalIndex={portalIndex}
    />
  </Modal>
);
