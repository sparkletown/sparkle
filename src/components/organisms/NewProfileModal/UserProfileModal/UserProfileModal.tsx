import React, { useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

import { IS_BURN } from "secrets";

import { PROFILE_MODAL_EDIT_MODE_TURNING_OFF_DELAY } from "settings";

import { User } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { venueLandingUrl } from "utils/url";

import { useShowHide } from "hooks/useShowHide";

import { ProfileModalContent } from "components/organisms/NewProfileModal/ProfileModal/ProfileModalContent";
import { UserProfileModalContent } from "components/organisms/NewProfileModal/UserProfileModal/UserProfileModalContent";

import "./UserProfileModal.scss";

interface Props {
  user: WithId<User>;
  venue: WithId<AnyVenue>;
  show: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({
  venue,
  show,
  user,
  onClose,
}: Props) => {
  const {
    isShown: editMode,
    show: turnOnEditMode,
    hide: turnOffEditMode,
  } = useShowHide(false);

  const firebase = useFirebase();
  const history = useHistory();

  const isSubmittingState = useShowHide(false);
  const { isShown: isSubmitting } = isSubmittingState;

  const logout = useCallback(async () => {
    await firebase.auth().signOut();

    history.push(
      //@debt seems like a legacy logic
      IS_BURN ? "/enter" : venue.id ? venueLandingUrl(venue.id) : "/"
    );
  }, [firebase, history, venue.id]);

  const hideHandler = useCallback(() => {
    if (isSubmitting) return;

    onClose();
    setTimeout(
      () => turnOffEditMode(),
      PROFILE_MODAL_EDIT_MODE_TURNING_OFF_DELAY
    );
  }, [isSubmitting, onClose, turnOffEditMode]);

  return (
    <Modal className="UserProfileModal" show={show} onHide={hideHandler}>
      <Modal.Body className="UserProfileModal__body">
        {editMode ? (
          <UserProfileModalContent
            user={user}
            venue={venue}
            onCancelEditing={turnOffEditMode}
            isSubmittingState={isSubmittingState}
          />
        ) : (
          <ProfileModalContent
            user={user}
            venue={venue}
            onPrimaryButtonClick={logout}
            onEditMode={turnOnEditMode}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};
