import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";

import { REACT_BOOTSTRAP_MODAL_HIDE_DURATION } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useShowHide } from "hooks/useShowHide";

import { useCurrentModalUser } from "components/organisms/NewProfileModal/useCurrentModalUser";

import { Loading } from "components/molecules/Loading";

import { NewProfileModalBody } from "./NewProfileModalBody";

import "./NewProfileModal.scss";

interface NewProfileModalProps {
  venue?: WithId<AnyVenue>;
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

  const { user, isLoaded } = useCurrentModalUser(selectedUserId);

  return (
    <Modal
      className="ProfileModal"
      show={hasSelectedProfile && isModalShown}
      onHide={hideHandler}
    >
      <Modal.Body className="ProfileModal__body">
        {isLoaded && user && (
          <NewProfileModalBody
            user={user}
            venue={venue}
            closeUserProfileModal={closeUserProfileModal}
          />
        )}
        {!user && (
          <div className="ProfileModalFetchUser">
            {!isLoaded ? (
              <Loading />
            ) : (
              <div>
                Oops, an error occurred while trying to load user data.{"\n"}
                Please contact our support team.
              </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
