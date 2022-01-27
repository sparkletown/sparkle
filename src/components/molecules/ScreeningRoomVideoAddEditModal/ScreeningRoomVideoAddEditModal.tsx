import React from "react";
import { Modal } from "react-bootstrap";

import { ScreeningRoomVideo } from "types/screeningRoom";

import { WithId } from "utils/id";

import { ScreeningRoomVideoAddEditForm } from "components/organisms/ScreeningRoomVideoAddEditForm";

export type ScreeningRoomVideoAddEditModalProps = {
  show: boolean;
  onHide: () => void;
  video?: WithId<ScreeningRoomVideo>;
};

export const ScreeningRoomVideoAddEditModal: React.FC<ScreeningRoomVideoAddEditModalProps> = ({
  onHide,
  show,
  video,
}) => (
  <Modal
    className="ScreeningRoomVideoAddEditModal"
    show={show}
    onHide={onHide}
    centered
  >
    <Modal.Body>
      <ScreeningRoomVideoAddEditForm onDone={onHide} video={video} />
    </Modal.Body>
  </Modal>
);
