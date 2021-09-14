import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import { OnSubmit } from "react-hook-form";

import { REACT_BOOTSTRAP_MODAL_HIDE_DURATION } from "settings";

import { UserProfileModalFormData } from "types/profileModal";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useShowHide } from "hooks/useShowHide";

import { ProfileModalFetchUserProps } from "components/organisms/NewProfileModal/components/ProfileModalFetchUser/ProfileModalFetchUser";

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
    isShown: isModalShown,
    hide: hideModal,
    show: showModal,
  } = useShowHide(true);

  const {
    isShown: isSubmitting,
    show: startSubmitting,
    hide: stopSubmitting,
  } = useShowHide();

  const hideHandler = useCallback(async () => {
    if (isSubmitting) return;

    hideModal();
    // when closeUserProfileModal is called modal hide animation starts
    // but selectedUserId is immediately undefined and while the modal is sliding away
    // an error message from ProfileModalFetchUser is shown

    // This is to fix that.
    setTimeout(() => {
      closeUserProfileModal();
      showModal();
    }, REACT_BOOTSTRAP_MODAL_HIDE_DURATION);
  }, [closeUserProfileModal, hideModal, isSubmitting, showModal]);

  const handleSubmitWrapper: (
    inner: OnSubmit<UserProfileModalFormData>
  ) => OnSubmit<UserProfileModalFormData> = useCallback(
    (inner: OnSubmit<UserProfileModalFormData>) => async (data) => {
      startSubmitting();
      try {
        await inner(data);
      } finally {
        stopSubmitting();
      }
    },
    [startSubmitting, stopSubmitting]
  );

  const renderBody: ProfileModalFetchUserProps["children"] = useCallback(
    (user) => (
      <NewProfileModalBody
        user={user}
        venue={venue}
        isSubmitting={isSubmitting}
        handleSubmitWrapper={handleSubmitWrapper}
        closeUserProfileModal={closeUserProfileModal}
      />
    ),
    [closeUserProfileModal, handleSubmitWrapper, isSubmitting, venue]
  );

  return (
    <Modal
      className="ProfileModal"
      show={hasSelectedProfile && isModalShown}
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
