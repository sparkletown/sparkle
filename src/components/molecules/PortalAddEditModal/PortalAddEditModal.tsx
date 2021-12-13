import React from "react";
import ReactModal from "react-modal";

import { PortalInfoListItem } from "settings";

import { Room } from "types/rooms";

import { PortalAddEditForm } from "components/organisms/PortalAddEditForm";

import "./PortalAddEditModal.scss";

export type PortalAddEditModalProps = {
  item?: PortalInfoListItem;
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
  <ReactModal
    shouldCloseOnOverlayClick
    shouldCloseOnEsc
    className="PortalAddEditModal"
    isOpen={show}
    onAfterClose={onHide}
    onRequestClose={onHide}
  >
    <PortalAddEditForm
      item={item}
      onDone={onHide}
      portal={portal}
      portalIndex={portalIndex}
    />
  </ReactModal>
);
