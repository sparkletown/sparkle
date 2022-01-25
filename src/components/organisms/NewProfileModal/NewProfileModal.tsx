import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";

import { REACT_BOOTSTRAP_MODAL_HIDE_DURATION } from "settings";

import { SpaceWithId } from "types/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useShowHide } from "hooks/useShowHide";

import { NewProfileModalBody } from "./NewProfileModalBody";

import "./NewProfileModal.scss";

interface NewProfileModalProps {
  space?: SpaceWithId;
}

export const NewProfileModal: React.FC<NewProfileModalProps> = ({ space }) => {
  const {
    selectedUserId,
    hasSelectedProfile,
    closeUserProfileModal,
  } = useProfileModalControls();

  const {
    isShown: isModalShown,
    hide: hideModal,
    show: showModal,
  } = useShowHide(true);

  const hideHandler = useCallback(async () => {
    hideModal();
    // when closeUserProfileModal is called modal hide animation starts
    // but selectedUserId is immediately undefined and while the modal is sliding away
    // an error message from ProfileModalFetchUser is shown

    // This is to fix that.
    window.setTimeout(() => {
      closeUserProfileModal();
      showModal();
    }, REACT_BOOTSTRAP_MODAL_HIDE_DURATION);
  }, [closeUserProfileModal, hideModal, showModal]);

  return (
    <Modal
      className="ProfileModal"
      show={hasSelectedProfile && isModalShown}
      onHide={hideHandler}
    >
      <Modal.Body className="ProfileModal__body">
        <NewProfileModalBody
          userId={selectedUserId}
          space={space}
          closeUserProfileModal={closeUserProfileModal}
        />
      </Modal.Body>
    </Modal>
  );
};
