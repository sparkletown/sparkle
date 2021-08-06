import { ProfileModalContent } from "components/organisms/NewProfileModal/ProfileModal/ProfileModalContent";
import { UserProfileModalContent } from "components/organisms/NewProfileModal/UserProfileModal/UserProfileModalContent/UserProfileModalContent";
import { useBooleanState } from "hooks/useBooleanState";
import React, { useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { IS_BURN } from "secrets";
import { User } from "types/User";
import { AnyVenue } from "types/venues";
import { WithId } from "utils/id";
import "./UserProfileModal.scss";
import { venueLandingUrl } from "utils/url";

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
  const [editMode, turnOnEditMode, turnOffEditMode] = useBooleanState(false);

  const firebase = useFirebase();
  const history = useHistory();

  const isSubmittingState = useBooleanState(false);
  const [isSubmitting] = isSubmittingState;

  const logout = useCallback(async () => {
    await firebase.auth().signOut();

    history.push(
      IS_BURN ? "/enter" : venue.id ? venueLandingUrl(venue.id) : "/"
    );
  }, [firebase, history, venue.id]);

  const hideHandler = useCallback(() => {
    if (!isSubmitting) {
      onClose();
      setTimeout(() => turnOffEditMode(), 130);
    }
  }, [isSubmitting, onClose, turnOffEditMode]);

  return (
    <Modal
      style={{ display: "flex" }}
      className="UserProfileModal"
      show={show}
      onHide={hideHandler}
    >
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
            viewingUser={user}
            venue={venue}
            onPrimaryButtonClick={logout}
            onEditMode={turnOnEditMode}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};
