import React, { useCallback, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

import { ENABLE_SUSPECTED_LOCATION, RANDOM_AVATARS } from "settings";

import {
  currentVenueSelector,
  currentVenueSelectorData,
  orderedVenuesSelector,
} from "utils/selectors";
import { WithId } from "utils/id";
import { venueInsideUrl, venuePreviewUrl } from "utils/url";

import { User } from "types/User";
import { isVenueWithRooms } from "types/venues";

import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useChatsSidebarControls } from "hooks/useChatsSidebar";

import { Badges } from "components/organisms/Badges";
import Button from "components/atoms/Button";

import "./UserProfileModal.scss";

type PropTypes = {
  show: boolean;
  onHide: () => void;
  zIndex?: number;
  userProfile?: WithId<User>;
};

const UserProfileModal: React.FunctionComponent<PropTypes> = ({
  show,
  onHide,
  zIndex,
  userProfile,
}) => {
  const venue = useSelector(currentVenueSelector);

  const { user } = useUser();

  const chosenUserId = userProfile?.id;

  const { openPrivateRecipientChat } = useChatsSidebarControls();

  const openChosenUserChat = useCallback(() => {
    if (!chosenUserId) return;

    openPrivateRecipientChat(chosenUserId);
    // NOTE: Hide the modal, after the chat is opened;
    onHide();
  }, [openPrivateRecipientChat, onHide, chosenUserId]);

  if (!userProfile || !chosenUserId || !user) {
    return <></>;
  }

  // REVISIT: remove the hack to cast to any below
  return (
    <Modal show={show} onHide={onHide} style={zIndex && { zIndex }}>
      <Modal.Body>
        <div className="modal-container modal-container_profile">
          <div className="profile-information-container">
            <div className="profile-basics">
              <div className="profile-pic">
                <img
                  src={userProfile.pictureUrl || "/default-profile-pic.png"}
                  alt="profile"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src =
                      "/avatars/" +
                      RANDOM_AVATARS[
                        Math.floor(
                          chosenUserId.charCodeAt(0) % RANDOM_AVATARS.length
                        )
                      ];
                  }}
                />
              </div>
              <div className="profile-text">
                <h2 className="italic">
                  {userProfile.partyName || "Captain Party"}
                </h2>
              </div>
            </div>
            <div className="profile-extras">
              {venue?.profile_questions?.map((question) => (
                <React.Fragment key="question.text">
                  <p className="light question">{question.text}</p>
                  <h6>
                    {/*
                    // @debt typing - need to support known User interface with unknown question keys
                    // @ts-ignore */}
                    {userProfile[question.name] || //@debt typing - look at the changelog, was this a bug?
                      "I haven't edited my profile to tell you yet"}
                  </h6>
                </React.Fragment>
              ))}
            </div>
            {ENABLE_SUSPECTED_LOCATION && (
              <div className="profile-location">
                <p className="question">Suspected Location:</p>
                <h6 className="location">
                  <SuspectedLocation user={userProfile} />
                </h6>
              </div>
            )}
          </div>
          {venue?.showBadges && (
            <Badges user={userProfile} currentVenue={venue} />
          )}
          {chosenUserId !== user.uid && (
            <Button onClick={openChosenUserChat}>Send message</Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

const SuspectedLocation: React.FC<{ user: WithId<User> }> = ({ user }) => {
  useFirestoreConnect("venues");
  const currentVenue = useSelector(currentVenueSelectorData);
  const allVenues = useSelector(orderedVenuesSelector);

  const suspectedLocation = useMemo(
    () => ({
      venue: allVenues?.find(
        (v) =>
          (user.lastSeenIn && user.lastSeenIn[currentVenue?.name ?? ""]) ||
          v.name === user.room
      ),
      room: allVenues?.find(
        (v) =>
          isVenueWithRooms(v) && v.rooms?.find((r) => r.title === user.room)
      ),
    }),
    [user, allVenues, currentVenue]
  );

  if (!user.room || !allVenues) {
    return null;
  }

  if (suspectedLocation.venue) {
    return (
      <Link to={venueInsideUrl(suspectedLocation.venue.id)}>
        {suspectedLocation.venue.name}
      </Link>
    );
  }

  if (suspectedLocation.room) {
    return (
      <Link to={venuePreviewUrl(suspectedLocation.room.id, user.room)}>
        Room {user.room}, in camp {suspectedLocation.room.name}
      </Link>
    );
  }

  return <>This user has gone walkabout. Location unguessable</>;
};

export default UserProfileModal;
