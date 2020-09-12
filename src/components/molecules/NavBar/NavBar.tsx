import React, { useState, useMemo, useRef } from "react";
import firebase from "firebase/app";
import "./NavBar.scss";
import "./playa.scss";
import { Link, useHistory } from "react-router-dom";
import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isChatValid } from "validation";
import { OverlayTrigger, Popover, Modal } from "react-bootstrap";
import PrivateChatModal from "components/organisms/PrivateChatModal";
import { ProfilePopoverContent } from "components/organisms/ProfileModal";
import { RadioModal } from "../../organisms/RadioModal/RadioModal";
import UpcomingTickets from "components/molecules/UpcomingTickets";
import { useUser } from "hooks/useUser";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import {
  DEFAULT_PROFILE_IMAGE,
  SPARKLEVERSE_LOGO_URL,
  PLAYA_VENUE_NAME,
  ALL_BURN_TEMPLATES,
  SPARKLE_LOGO_URL,
} from "settings";
import { IS_BURN } from "secrets";
import { useSelector } from "hooks/useSelector";
import OnlineStats from "../OnlineStats";
import { SchedulePageModal } from "../../organisms/SchedulePageModal/SchedulePageModal";
import { useRadio } from "hooks/useRadio";
import { GiftTicketModal } from "../../organisms/GiftTicketModal/GiftTicketModal";
import PlayaTime from "../PlayaTime";
import PlayaAddress from "../PlayaAddress";

interface PropsType {
  redirectionUrl?: string;
}

const NavBar: React.FunctionComponent<PropsType> = ({ redirectionUrl }) => {
  const { user, profile } = useUser();
  const { venue, privateChats, radioStations } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
    privateChats: state.firestore.ordered.privatechats,
    radioStations: state.firestore.data.venues?.playa?.radioStations,
  }));
  const {
    location: { pathname },
  } = useHistory();
  const isOnPlaya =
    pathname.toLowerCase() === `/in/${PLAYA_VENUE_NAME}`.toLowerCase();

  const now = firebase.firestore.Timestamp.fromDate(new Date());
  const futureUpcoming =
    venue?.events?.filter((e) => e.ts_utc.valueOf() > now.valueOf()) ?? []; //@debt typing does this exist?

  const hasUpcomingEvents = futureUpcoming && futureUpcoming.length > 0;

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

  const profilePopover = (
    <Popover id="profile-popover">
      <Popover.Content>
        <ProfilePopoverContent />
      </Popover.Content>
    </Popover>
  );

  const giftPopover = (
    <Popover id="gift-popover">
      <Popover.Content>
        <GiftTicketModal />
      </Popover.Content>
    </Popover>
  );

  const sound = useMemo(
    () =>
      radioStations && radioStations.length
        ? new Audio(radioStations[0])
        : undefined,
    [radioStations]
  );

  const { volume, setVolume } = useRadio(sound);

  const radioPopover = (
    <Popover id="radio-popover">
      <Popover.Content>
        <RadioModal volume={volume} setVolume={setVolume} />
      </Popover.Content>
    </Popover>
  );

  const radioFirstPlayStateLoaded = useRef(false);
  const showRadioOverlay = useMemo(() => {
    if (!radioFirstPlayStateLoaded.current) {
      const radioFirstPlayStorageKey = "radioFirstPlay";
      const radioFirstPlayState = localStorage.getItem(
        radioFirstPlayStorageKey
      );
      if (!radioFirstPlayState) {
        localStorage.setItem(radioFirstPlayStorageKey, JSON.stringify(true));
        return true;
      }
      radioFirstPlayStateLoaded.current = true;
    }
    return false;
  }, [radioFirstPlayStateLoaded]);

  const numberOfUnreadMessages = useMemo(() => {
    return (
      privateChats &&
      user &&
      privateChats
        .filter(isChatValid)
        .filter((chat) => chat.to === user.uid && chat.isRead === false).length
    );
  }, [privateChats, user]);

  const [showEventSchedule, setShowEventSchedule] = useState(false);

  const isBurnTemplate =
    !!venue?.template && IS_BURN && ALL_BURN_TEMPLATES.includes(venue.template);

  return (
    <>
      <header>
        <div className={`navbar navbar_playa ${!isOnPlaya && "nonplaya"}`}>
          <div className="navbar-container">
            <div className="navbar-logo_container">
              <div className="navbar-logo">
                <Link to={redirectionUrl || "/in/playa"}>
                  <img
                    src={
                      isBurnTemplate ? SPARKLEVERSE_LOGO_URL : SPARKLE_LOGO_URL
                    }
                    alt="Logo"
                    className={`logo-img ${
                      isBurnTemplate ? "sparkleverse" : "sparkle"
                    }`}
                  />
                </Link>
              </div>
              {isBurnTemplate && (
                <div className="navbar-info">
                  <PlayaTime />
                  <PlayaAddress />
                </div>
              )}
            </div>
            {user ? (
              <>
                {isBurnTemplate && (
                  <div className="navbar-dropdown-middle">
                    {isOnPlaya ? (
                      <OnlineStats />
                    ) : (
                      <span
                        onClick={() => (window.location.href = "/in/playa")}
                        className="playa-link"
                      >
                        Back to the Playa
                      </span>
                    )}
                  </div>
                )}
                <div className="navbar-links">
                  {isBurnTemplate && (
                    <div className="profile-icon button-container navbar-link-schedule">
                      <div onClick={() => setShowEventSchedule(true)}>
                        Live Schedule
                      </div>
                    </div>
                  )}
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
                  {isBurnTemplate && (
                    <OverlayTrigger
                      trigger="click"
                      placement="bottom-end"
                      overlay={giftPopover}
                      rootClose={true}
                    >
                      <span className="private-chat-icon">
                        <div className="navbar-link-gift"></div>
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
                      <span className="private-chat-icon">
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
                  {isBurnTemplate && (
                    <OverlayTrigger
                      trigger="click"
                      placement="bottom-end"
                      overlay={radioPopover}
                      rootClose={true}
                      defaultShow={showRadioOverlay}
                    >
                      <div
                        className={`profile-icon navbar-link-radio ${
                          volume === 0 && "off"
                        }`}
                      ></div>
                    </OverlayTrigger>
                  )}
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom-end"
                    overlay={profilePopover}
                    rootClose={true}
                  >
                    <div className="navbar-link-profile">
                      <img
                        src={profile?.pictureUrl || DEFAULT_PROFILE_IMAGE}
                        className="profile-icon"
                        alt="avatar"
                        width="40"
                        height="40"
                      />
                    </div>
                  </OverlayTrigger>
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
      <AuthenticationModal
        show={isAuthenticationModalOpen}
        onHide={() => setIsAuthenticationModalOpen(false)}
        showAuth="login"
      />
      <Modal
        show={showEventSchedule}
        onHide={() => setShowEventSchedule(false)}
        dialogClassName="custom-dialog"
      >
        <Modal.Body>
          <SchedulePageModal />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavBar;
