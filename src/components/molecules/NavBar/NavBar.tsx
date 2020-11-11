import React, { useState, useMemo, useRef } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { Link, useHistory } from "react-router-dom";
import { OverlayTrigger, Popover, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";

import firebase from "firebase/app";
import {
  DEFAULT_PROFILE_IMAGE,
  SPARKLEVERSE_LOGO_URL,
  PLAYA_VENUE_ID,
  SPARKLE_LOGO_URL,
  DEFAULT_VENUE,
  MEMRISE_LOGO_URL,
  PLAYA_VENUE_NAME,
  HOMEPAGE_URL,
} from "settings";
import { IS_BURN } from "secrets";
import { isChatValid } from "validation";
import { VenueTemplate } from "types/VenueTemplate";
import { venueInsideUrl } from "utils/url";

import { useRadio } from "hooks/useRadio";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import AuthenticationModal from "components/organisms/AuthenticationModal";
import PrivateChatModal from "components/organisms/PrivateChatModal";
import { GiftTicketModal } from "components/organisms/GiftTicketModal/GiftTicketModal";
import { ProfilePopoverContent } from "components/organisms/ProfileModal";
import { RadioModal } from "components/organisms/RadioModal/RadioModal";
import { SchedulePageModal } from "components/organisms/SchedulePageModal/SchedulePageModal";

import OnlineStats from "components/molecules/OnlineStats";
import PlayaAddress from "components/molecules/PlayaAddress";
import PlayaTime from "components/molecules/PlayaTime";
import UpcomingTickets from "components/molecules/UpcomingTickets";

import "./NavBar.scss";
import "./playa.scss";

interface PropsType {
  redirectionUrl?: string;
}

const NavBar: React.FunctionComponent<PropsType> = ({ redirectionUrl }) => {
  const { user, profile } = useUser();
  const venueId = useVenueId();
  const { venue, privateChats, radioStations, parentVenue } = useSelector(
    (state) => ({
      venue: state.firestore.data.currentVenue,
      privateChats: state.firestore.ordered.privatechats,
      radioStations: state.firestore.data.venues?.playa?.radioStations,
      parentVenue: state.firestore.data.parentVenue,
    })
  );

  useFirestoreConnect([
    {
      collection: "venues",
      doc: venue?.parentId,
      storeAs: "parentVenue",
    },
  ]);

  const {
    location: { pathname },
  } = useHistory();
  const isOnPlaya = pathname.toLowerCase() === venueInsideUrl(PLAYA_VENUE_ID);

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
        <RadioModal
          volume={volume}
          setVolume={setVolume}
          title={venue?.radioTitle}
        />
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

  const getHeaderLogo = () => {
    if (venue?.template === VenueTemplate.avatargrid) {
      return MEMRISE_LOGO_URL;
    }
    return IS_BURN ? SPARKLEVERSE_LOGO_URL : SPARKLE_LOGO_URL;
  };

  return (
    <>
      <header>
        <div className={`navbar navbar_playa ${!isOnPlaya && "nonplaya"}`}>
          <div className="navbar-container">
            <div className="navbar-logo_container">
              <div className="navbar-logo">
                <Link
                  to={
                    redirectionUrl ?? venueId
                      ? venueInsideUrl(venueId ?? "")
                      : "/"
                  }
                >
                  <img
                    src={getHeaderLogo()}
                    alt="Logo"
                    className={`logo-img ${
                      IS_BURN ? "sparkleverse" : "sparkle"
                    }`}
                  />
                </Link>
                {venue?.showLearnMoreLink && (
                  <div className="button-container about-button-container">
                    <a
                      href={HOMEPAGE_URL}
                      className="about-button"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More
                    </a>
                  </div>
                )}
              </div>
              {IS_BURN && (
                <div className="navbar-info">
                  <PlayaTime />
                  {venue?.showAddress && <PlayaAddress />}
                </div>
              )}
            </div>
            {user ? (
              <>
                {IS_BURN && (
                  <div className="navbar-dropdown-middle">
                    {isOnPlaya ? (
                      <OnlineStats />
                    ) : (
                      <span
                        onClick={() =>
                          (window.location.href = venueInsideUrl(DEFAULT_VENUE))
                        }
                        className="back-link"
                      >
                        Back to {PLAYA_VENUE_NAME}
                      </span>
                    )}
                  </div>
                )}
                {!IS_BURN && (
                  <div className="venue-bar">
                    <div className="venue-name">{venue?.name}</div>
                    {venue?.parentId && (
                      <span
                        onClick={() =>
                          (window.location.href = venueInsideUrl(
                            venue?.parentId ?? ""
                          ))
                        }
                        className="back-link"
                      >
                        Back{parentVenue ? ` to ${parentVenue.name}` : ""}
                      </span>
                    )}
                  </div>
                )}
                <div className="navbar-links">
                  {venue?.showLiveSchedule && (
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
                  {IS_BURN && venue?.showGiftATicket && (
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
                  {IS_BURN && (
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
