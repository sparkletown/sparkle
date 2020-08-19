import React, { useState, useMemo } from "react";
import firebase from "firebase/app";
import "./NavBar.scss";
import "./playa.scss";
import { Link } from "react-router-dom";
import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isChatValid } from "validation";
import { OverlayTrigger, Popover } from "react-bootstrap";
import PrivateChatModal from "components/organisms/PrivateChatModal";
import ProfileModal from "components/organisms/ProfileModal";
import UpcomingTickets from "components/molecules/UpcomingTickets";
import { useUser } from "hooks/useUser";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import { DEFAULT_PROFILE_IMAGE } from "settings";
import { useSelector } from "hooks/useSelector";
import OnlineStats from "../OnlineStats";

interface PropsType {
  redirectionUrl?: string;
}

const NavBar: React.FunctionComponent<PropsType> = ({ redirectionUrl }) => {
  const { user, profile } = useUser();
  const { venue, privateChats } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
    privateChats: state.firestore.ordered.privatechats,
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

  const chatPopover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <PrivateChatModal />
      </Popover.Content>
    </Popover>
  );

  const numberOfUnreadMessages = useMemo(() => {
    return (
      privateChats &&
      user &&
      privateChats
        .filter(isChatValid)
        .filter((chat) => chat.to === user.uid && chat.isRead === false).length
    );
  }, [privateChats, user]);

  return (
    <>
      <header>
        <div className="navbar navbar_playa">
          <div className="navbar-container">
            <div className="navbar-logo" style={{ width: 500 }}>
              <Link to={redirectionUrl || "/"}>
                <img
                  src={"/sparkleverse-logo.png"}
                  alt="Logo"
                  className="logo-img"
                />
              </Link>
              <div className="button-container create-button-container">
                <Link to="/admin" className="create-button">
                  Create
                </Link>
              </div>
            </div>
            {user ? (
              <>
                <div
                  className="navbar-dropdown-middle"
                  style={{ width: 500, textAlign: "center" }}
                >
                  <OnlineStats />
                </div>
                <div className="navbar-links" style={{ width: 500 }}>
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
                  {profile && (
                    <OverlayTrigger
                      trigger="click"
                      placement="bottom-end"
                      overlay={chatPopover}
                      rootClose={true}
                    >
                      <span>
                        {!!numberOfUnreadMessages &&
                          numberOfUnreadMessages > 0 && (
                            <div className="notification-card">
                              {numberOfUnreadMessages}
                            </div>
                          )}
                        <div className="navbar-link-message"></div>
                      </span>
                    </OverlayTrigger>
                  )}
                  <div
                    className="navbar-link-profile"
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
                  <div className="navbar-link-menu"></div>
                </div>
              </>
            ) : (
              <div
                className="log-in-button"
                style={{ marginTop: "20px" }}
                onClick={() => setIsAuthenticationModalOpen(true)}
              >
                Log in
              </div>
            )}
          </div>
        </div>
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
