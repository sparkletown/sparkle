import React, { useState } from "react";
import firebase from "firebase/app";
import "./NavBar.scss";
import { Link } from "react-router-dom";
import {
  /*faCommentAlt,*/ faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { isChatValid } from "validation";
import { OverlayTrigger, Popover } from "react-bootstrap";
// import PrivateChatModal from "components/organisms/PrivateChatModal";
import ProfileModal from "components/organisms/ProfileModal";
import UpcomingTickets from "components/molecules/UpcomingTickets";
import { useUser } from "hooks/useUser";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import { DEFAULT_PROFILE_IMAGE } from "settings";
import { useSelector } from "hooks/useSelector";

interface PropsType {
  redirectionUrl?: string;
}

const NavBar: React.FunctionComponent<PropsType> = ({ redirectionUrl }) => {
  const { user, profile } = useUser();
  const { venue /*privateChats*/ } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
    // privateChats: state.firestore.ordered.privatechats,
  }));

  const now = firebase.firestore.Timestamp.fromDate(new Date());
  const futureUpcoming =
    venue?.events?.filter((e) => e.ts_utc.valueOf() > now.valueOf()) ?? []; //@debt typing does this exist?

  const hasUpcomingEvents = futureUpcoming && futureUpcoming.length > 0;

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthenticationModalOpen, setIsAuthenticationModalOpen] = useState(
    false
  );

  const ticketsPopover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <UpcomingTickets events={futureUpcoming} />
      </Popover.Content>
    </Popover>
  );

  // const chatPopover = (
  //   <Popover id="popover-basic">
  //     <Popover.Content>
  //       <PrivateChatModal />
  //     </Popover.Content>
  //   </Popover>
  // );

  // const numberOfUnreadMessages =
  //   privateChats &&
  //   user &&
  //   privateChats
  //     .filter(isChatValid)
  //     .filter((chat) => chat.to === user.uid && chat.isRead === false).length;

  return (
    <>
      <header>
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark navbar-container">
          <Link to={redirectionUrl || "/"}>
            <span className="navbar-brand title">
              <img
                className="sparkle-navbar-icon"
                src="/sparkleverse-header.png"
                alt="Sparkle collective"
              />
            </span>
          </Link>
          {user ? (
            <div className="icons-container">
              {hasUpcomingEvents && (
                <OverlayTrigger
                  trigger="click"
                  placement="bottom-end"
                  overlay={ticketsPopover}
                  rootClose={true}
                >
                  <span className="tickets-icon">
                    <FontAwesomeIcon icon={faTicketAlt} />
                  </span>
                </OverlayTrigger>
              )}
              {/*profile && (
                <OverlayTrigger
                  trigger="click"
                  placement="bottom-end"
                  overlay={chatPopover}
                  rootClose={true}
                >
                  <span className="private-chat-icon">
                    {!!numberOfUnreadMessages && numberOfUnreadMessages > 0 && (
                      <div className="notification-card">
                        {numberOfUnreadMessages}
                      </div>
                    )}
                    <FontAwesomeIcon icon={faCommentAlt} />
                  </span>
                </OverlayTrigger>
              )*/}
              <div
                className="profile-icon-container"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <img
                  src={profile?.pictureUrl || DEFAULT_PROFILE_IMAGE}
                  className="profile-icon"
                  alt="avatar"
                  width="40"
                  height="40"
                />
              </div>
            </div>
          ) : (
            <div
              className="log-in-button"
              onClick={() => setIsAuthenticationModalOpen(true)}
            >
              Log in
            </div>
          )}
        </nav>
      </header>
      <ProfileModal
        show={isProfileModalOpen}
        onHide={() => setIsProfileModalOpen(false)}
      />
      <AuthenticationModal
        show={isAuthenticationModalOpen}
        onHide={() => setIsAuthenticationModalOpen(false)}
        showAuth="login"
      />
    </>
  );
};

export default NavBar;
