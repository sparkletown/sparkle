import React, { FC } from "react";
import { Modal } from "react-bootstrap";
import { ChatRequest, ChatRequestState } from "types/ChatRequest";
import { WithId } from "utils/id";
import { User } from "types/User";
import { useUser } from "hooks/useUser";
import { useFirebase } from "react-redux-firebase";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

interface PropsType {
  show: boolean;
  host?: WithId<User>;
  request: ChatRequest;
}

export const ChatRequestModal: FC<PropsType> = ({ show, host, request }) => {
  const firebase = useFirebase();
  const { user } = useUser();
  const venueId = useVenueId();
  const venue = useSelector((state) => state.firestore.ordered.currentVenue);

  const onAcceptRequest = () => {
    firebase
      .firestore()
      .doc(`experiences/${venueId}/chatRequests/${request.id}`)
      .update({ state: ChatRequestState.Accepted });
  };

  const onDeclineRequest = () => {
    firebase
      .firestore()
      .doc(`experiences/${venueId}/chatRequests/${request.id}`)
      .update({ state: ChatRequestState.Declined });
  };

  return (
    <Modal show={show}>
      <div style={{ textAlign: "center", padding: 20 }}>
        You have a video chat request from: {host?.partyName}
      </div>

      <div>
        <button
          className="btn btn-block btn-centered"
          onClick={onAcceptRequest}
        >
          Accept
        </button>
        <button
          className="btn btn-block btn-centered"
          onClick={onDeclineRequest}
        >
          Decline
        </button>
      </div>
    </Modal>
  );
};

export default ChatRequestModal;
