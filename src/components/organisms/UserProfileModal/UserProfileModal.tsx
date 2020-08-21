import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useUser } from "hooks/useUser";

import "./UserProfileModal.scss";
import Chatbox from "../Chatbox";
import { User } from "types/User";
import { useSelector } from "hooks/useSelector";
import { WithId } from "utils/id";
import { venuePlayaPreviewUrl, venueInsideUrl } from "utils/url";
import { isCampVenue } from "types/CampVenue";
import { Link } from "react-router-dom";
import { PLAYA_VENUE_NAME } from "settings";

type fullUserProfile =
  | { userProfile?: WithId<User> }
  | { userProfile?: User; userProfileId?: string };

type PropTypes = {
  show: boolean;
  onHide: () => void;
  zIndex?: number;
} & fullUserProfile;

const UserProfileModal: React.FunctionComponent<PropTypes> = ({
  show,
  onHide,
  zIndex,
  ...rest
}) => {
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  }));

  const { user } = useUser();

  const fullUserProfile = useMemo(() => {
    if (undefined === rest.userProfile) {
      return undefined;
    }

    if ("id" in rest.userProfile) {
      return rest.userProfile;
    }

    if ("userProfileId" in rest && rest.userProfileId) {
      return { ...rest.userProfile, id: rest.userProfileId };
    }
    return undefined;
  }, [rest]);

  if (!fullUserProfile || !fullUserProfile.id || !user) {
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
                  src={fullUserProfile.pictureUrl || "/default-profile-pic.png"}
                  alt="profile"
                />
              </div>
              <div className="profile-text">
                <h2 className="italic">
                  {fullUserProfile.partyName || "Captain Party"}
                </h2>
              </div>
            </div>
            <div className="profile-extras">
              {venue.profile_questions?.map((question) => (
                <React.Fragment key="question.text">
                  <p className="light question">{question.text}</p>
                  <h6>
                    {/*
                    // @debt typing - need to support known User interface with unknown question keys
                    // @ts-ignore */}
                    {fullUserProfile[question.name] || //@debt typing - look at the changelog, was this a bug?
                      "I haven't edited my profile to tell you yet"}
                  </h6>
                </React.Fragment>
              ))}
            </div>
            <div className="profile-location">
              <p className="question">Suspected Location:</p>
              <h6 className="location">
                <SuspectedLocation user={fullUserProfile} />
              </h6>
            </div>
          </div>
          {fullUserProfile.id !== user.uid && (
            <div className="private-chat-container">
              <Chatbox isInProfileModal discussionPartner={fullUserProfile} />
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

const SuspectedLocation: React.FC<{ user: WithId<User> }> = ({ user }) => {
  const venues = useSelector((state) => state.firestore.ordered.venues);
  if (!user.room || !venues) {
    return <></>;
  }

  const suspectedLocation = venues
    ?.filter(
      (v) =>
        v.name === user.room ||
        (isCampVenue(v) && v.rooms.find((r) => r.title === user.room))
    )
    .map((v) => {
      if (v.name === user.room) {
        return {
          venueId: user.room,
          roomTitle: undefined,
        };
      }
      return {
        venueId: v.id,
        venueName: v.name,
        roomTitle: user.room,
      };
    })[0];

  if (!suspectedLocation) {
    return <>This burner has gone walkabout. Location unguessable</>;
  }

  const suspectedLocationLink =
    user.room === PLAYA_VENUE_NAME
      ? venueInsideUrl(suspectedLocation.venueId)
      : suspectedLocation.roomTitle
      ? venuePlayaPreviewUrl(suspectedLocation.venueId) // need something for camp popup here if roomTitle ie defined
      : venuePlayaPreviewUrl(suspectedLocation.venueId);

  const suspectedLocationText = suspectedLocation.roomTitle
    ? `Room ${suspectedLocation.roomTitle}, in Camp ${suspectedLocation.venueName}`
    : user.room;
  return <Link to={suspectedLocationLink}>{suspectedLocationText}</Link>;
};

export default UserProfileModal;
