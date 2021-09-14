import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";

import { REACT_BOOTSTRAP_MODAL_HIDE_DURATION } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useShowHide } from "hooks/useShowHide";

import { ProfileModalUserLoadingProps } from "components/organisms/NewProfileModal/components/ProfileModalFetchUser/ProfileModalFetchUser";

import { ProfileModalFetchUser } from "./components/ProfileModalFetchUser";
import { NewProfileModalBody } from "./NewProfileModalBody";

import "./NewProfileModal.scss";

interface NewProfileModalProps {
  venue: WithId<AnyVenue>;
}

export const NewProfileModal: React.FC<NewProfileModalProps> = ({ venue }) => {
  const {
    selectedUserId,
    hasSelectedProfile,
    closeUserProfileModal,
  } = useProfileModalControls();

  const {
    isShown: canShowModal,
    hide: instantHide,
    show: setCanShowModal,
  } = useShowHide(true);

  const submitState = useShowHide();
  const { isShown: isSubmitted } = submitState;

  const hideHandler = useCallback(async () => {
    if (isSubmitted) return;

    instantHide();
    // when closeUserProfileModal is called modal hide animation starts
    // but selectedUserId is immediately undefined and while the modal is sliding away
    // an error message from ProfileModalFetchUser is shown

    // This is to fix that.
    setTimeout(() => {
      closeUserProfileModal();
      setCanShowModal();
    }, REACT_BOOTSTRAP_MODAL_HIDE_DURATION);
  }, [closeUserProfileModal, instantHide, isSubmitted, setCanShowModal]);

  const renderBody: ProfileModalUserLoadingProps["children"] = useCallback(
    (user, refreshUser) => (
      <NewProfileModalBody
        user={user}
        venue={venue}
        refreshUser={refreshUser}
        submitState={submitState}
        closeUserProfileModal={closeUserProfileModal}
      />
    ),
    [closeUserProfileModal, submitState, venue]
  );

  return (
    <Modal
      className="ProfileModal"
      show={hasSelectedProfile && canShowModal}
      onHide={hideHandler}
    >
      <Modal.Body className="ProfileModal__body">
        <ProfileModalFetchUser userId={selectedUserId}>
          {renderBody}
        </ProfileModalFetchUser>
      </Modal.Body>
    </Modal>
  );
};
