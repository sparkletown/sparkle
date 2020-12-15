import React, { useCallback, useContext, useMemo } from "react";
import { Modal } from "react-bootstrap";

import {
  currentVenueSelector,
  currentVenueSelectorData,
  orderedVenuesSelector,
  privateChatsSelector,
} from "utils/selectors";

import { useUser } from "hooks/useUser";

import "./UserProfileModal.scss";
import ChatBox from "components/molecules/Chatbox";
import { User } from "types/User";
import { useSelector } from "hooks/useSelector";
import { WithId } from "utils/id";
import { venueInsideUrl, venuePreviewUrl } from "utils/url";
import { isCampVenue } from "types/CampVenue";
import { Link } from "react-router-dom";
import { ENABLE_SUSPECTED_LOCATION, RANDOM_AVATARS } from "settings";
import { useFirestoreConnect } from "react-redux-firebase";
import {
  ChatContext,
  PrivateChatMessage,
} from "components/context/ChatContext";
import { Badges } from "../Badges";
import { isTruthy } from "utils/types";

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
  const privateChats = useSelector(privateChatsSelector) ?? [];

  const { user } = useUser();

  const chatContext = useContext(ChatContext);

  const submitMessage = useCallback(
    async (data: { messageToTheBand: string }) => {
      if (!chatContext || !user || !userProfile) return;

      chatContext.sendPrivateChat(
        user.uid,
        userProfile?.id,
        data.messageToTheBand
      );
    },
    [chatContext, userProfile, user]
  );

  const chats: WithId<PrivateChatMessage>[] = useMemo(() => {
    if (!userProfile || !userProfile.id) return [];
    return privateChats.filter(
      (chat) => chat.from === userProfile.id || chat.to === userProfile.id
    );
  }, [privateChats, userProfile]);

  if (!userProfile || !userProfile.id || !user) {
    return <></>;
  }

  const showBadges = isTruthy(venue?.showBadges);

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
                          userProfile.id.charCodeAt(0) % RANDOM_AVATARS.length
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
          {showBadges && <Badges user={userProfile} currentVenue={venue} />}
          {userProfile.id !== user.uid && (
            <div className="private-chat-container">
              <ChatBox
                chats={chats}
                onMessageSubmit={submitMessage}
                showSenderImage={false}
              />
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

const SuspectedLocation: React.FC<{ user: WithId<User> }> = ({ user }) => {
  useFirestoreConnect("venues");
  const venue = useSelector(currentVenueSelectorData);
  const venues = useSelector(orderedVenuesSelector);

  const suspectedLocation = useMemo(
    () => ({
      venue: venues?.find(
        (v) =>
          (user.lastSeenIn && user.lastSeenIn[venue?.name ?? ""]) ||
          v.name === user.room
      ),
      camp: venues?.find(
        (v) => isCampVenue(v) && v.rooms.find((r) => r.title === user.room)
      ),
    }),
    [user, venues, venue]
  );

  if (!user.room || !venues) {
    return <></>;
  }

  if (suspectedLocation.venue) {
    return (
      <Link to={venueInsideUrl(suspectedLocation.venue.id)}>
        {suspectedLocation.venue.name}
      </Link>
    );
  }
  if (suspectedLocation.camp) {
    return (
      <Link to={venuePreviewUrl(suspectedLocation.camp.id, user.room)}>
        Room {user.room}, in camp {suspectedLocation.camp.name}
      </Link>
    );
  }
  return <>This burner has gone walkabout. Location unguessable</>;
};

export default UserProfileModal;
