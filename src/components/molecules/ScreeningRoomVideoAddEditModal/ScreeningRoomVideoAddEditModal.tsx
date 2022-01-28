import React from "react";

import { ScreeningRoomVideo } from "types/screeningRoom";

import { WithId } from "utils/id";

import { ScreeningRoomVideoAddEditForm } from "components/organisms/ScreeningRoomVideoAddEditForm";

import { Modal } from "components/molecules/Modal";

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
    isOpen={show}
    onClose={onHide}
    isCentered
  >
    <ScreeningRoomVideoAddEditForm onDone={onHide} video={video} />
  </Modal>
);
