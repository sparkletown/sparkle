import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  ReduxFirestoreQuerySetting,
  useFirestoreConnect,
} from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { OverlayTrigger, Popover } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";

import firebase from "firebase/app";

import { DEFAULT_PROFILE_IMAGE, PLAYA_VENUE_ID } from "settings";
import { IS_BURN } from "secrets";
import { isChatValid } from "validation";

import { UpcomingEvent } from "types/UpcomingEvent";
import { VenueTemplate } from "types/VenueTemplate";

import {
  currentVenueSelectorData,
  parentVenueSelector,
  privateChatsSelector,
  radioStationsSelector,
} from "utils/selectors";
import { hasElements } from "utils/types";
import { venueInsideUrl } from "utils/url";

import { useRadio } from "hooks/useRadio";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { GiftTicketModal } from "components/organisms/GiftTicketModal/GiftTicketModal";
import { ProfilePopoverContent } from "components/organisms/ProfileModal";
import { RadioModal } from "components/organisms/RadioModal/RadioModal";
import { SchedulePageModal } from "components/organisms/SchedulePageModal/SchedulePageModal";

import ChatsList from "components/molecules/ChatsList";
import NavSearchBar from "components/molecules/NavSearchBar";
import UpcomingTickets from "components/molecules/UpcomingTickets";
import { VenuePartygoers } from "components/molecules/VenuePartygoers";

import { NavBarLogin } from "./NavBarLogin";

import "./NavBar.scss";
import * as S from "./Navbar.styles";
import "./playa.scss";

const TicketsPopover: React.FC<{ futureUpcoming: UpcomingEvent[] }> = (
  props: unknown,
  { futureUpcoming }
) => (
  <Popover id="popover-basic" {...props}>
    <Popover.Content>
      <UpcomingTickets events={futureUpcoming} />
    </Popover.Content>
  </Popover>
);

const ChatPopover = (
  <Popover id="popover-basic">
    <Popover.Content>
      <ChatsList />
    </Popover.Content>
  </Popover>
);

const ProfilePopover = (
  <Popover id="profile-popover">
    <Popover.Content>
      <ProfilePopoverContent />
    </Popover.Content>
  </Popover>
);

const GiftPopover = (
  <Popover id="gift-popover">
    <Popover.Content>
      <GiftTicketModal />
    </Popover.Content>
  </Popover>
);

interface NavBarPropsType {
  redirectionUrl?: string;
}

const NavBar: React.FC<NavBarPropsType> = ({ redirectionUrl }) => {
  const { user, profile } = useUser();
  const venueId = useVenueId();
  const venue = useSelector(currentVenueSelectorData);
  const privateChats = useSelector(privateChatsSelector);
  const radioStations = useSelector(radioStationsSelector);
  const parentVenue = useSelector(parentVenueSelector);

  const venueParentId = venue?.parentId;
  const venueParentQuery = useMemo<ReduxFirestoreQuerySetting>(
    () => ({
      collection: "venues",
      doc: venueParentId,
      storeAs: "parentVenue",
    }),
    [venueParentId]
  );
  useFirestoreConnect(venueParentId ? venueParentQuery : undefined);

  const numberOfUnreadMessages = useMemo(() => {
    if (!user || !privateChats) return 0;

    return privateChats
      .filter(isChatValid)
      .filter((chat) => chat.to === user.uid && !chat.isRead).length;
  }, [privateChats, user]);

  const {
    location: { pathname },
  } = useHistory();
  const isOnPlaya = pathname.toLowerCase() === venueInsideUrl(PLAYA_VENUE_ID);

  const now = firebase.firestore.Timestamp.fromDate(new Date());
  const futureUpcoming =
    venue?.events?.filter((e) => e.ts_utc.valueOf() > now.valueOf()) ?? []; //@debt typing does this exist?

  const hasUpcomingEvents = futureUpcoming && futureUpcoming.length > 0;

  const hasRadioStations = radioStations && radioStations.length;
  const isSoundCloud =
    !!hasRadioStations && RegExp("soundcloud").test(radioStations![0]);

  const sound = useMemo(
    () =>
      radioStations && hasElements(radioStations) && !isSoundCloud
        ? new Audio(radioStations[0])
        : undefined,
    [isSoundCloud, radioStations]
  );

  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const { volume, setVolume } = useRadio(isRadioPlaying, sound);

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

  const [isEventScheduleVisible, setEventScheduleVisible] = useState(false);
  const toggleEventSchedule = useCallback(() => {
    setEventScheduleVisible(!isEventScheduleVisible);
  }, [isEventScheduleVisible]);
  const hideEventSchedule = useCallback(() => {
    setEventScheduleVisible(false);
  }, []);

  const parentVenueId = venue?.parentId ?? "";
  const backToParentVenue = useCallback(() => {
    window.location.href = venueInsideUrl(parentVenueId);
  }, [parentVenueId]);

  const navigateToHomepage = useCallback(() => {
    const venueLink =
      redirectionUrl ?? venueId ? venueInsideUrl(venueId ?? "") : "/";

    window.location.href = venueLink;
  }, [redirectionUrl, venueId]);

  const handleRadioEnable = useCallback(() => setIsRadioPlaying(true), []);

  const [showRadioPopover, setShowRadioPopover] = useState(false);

  const toggleShowRadioPopover = useCallback(
    () => setShowRadioPopover((prevState) => !prevState),
    []
  );

  if (!venueId || !venue) return null;

  const isVenueUsingPartyMap = venue.template === VenueTemplate.partymap;

  // TODO: ideally this would find the top most parent of parents and use those details
  const navbarTitle = parentVenue?.name ?? venue.name;

  const profileImage = profile?.pictureUrl || DEFAULT_PROFILE_IMAGE;

  const radioStation = !!hasRadioStations && radioStations![0];

  const showNormalRadio = (venue?.showRadio && !isSoundCloud) ?? false;
  const showSoundCloudRadio = (venue?.showRadio && isSoundCloud) ?? false;

  return (
    <>
      <header>
        <div className={`navbar navbar_playa ${!isOnPlaya && "nonplaya"}`}>
          <div className="navbar-container">
            <div className="nav-logos">
              <div className="nav-sparkle-logo">
                <div />
              </div>
              <div
                className="nav-sparkle-logo_small"
                onClick={navigateToHomepage}
              >
                <div />
              </div>
              <div
                className={`nav-party-logo ${
                  isEventScheduleVisible && "clicked"
                }`}
                onClick={toggleEventSchedule}
              >
                {navbarTitle} Schedule
              </div>
              <VenuePartygoers />
            </div>

            {!user && <NavBarLogin />}

            {user && (
              <div className="navbar-links">
                <NavSearchBar />

                {hasUpcomingEvents && (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom-end"
                    overlay={<TicketsPopover futureUpcoming={futureUpcoming} />}
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
                    overlay={GiftPopover}
                    rootClose={true}
                  >
                    <span className="private-chat-icon">
                      <div className="navbar-link-gift" />
                    </span>
                  </OverlayTrigger>
                )}

                {!isVenueUsingPartyMap && (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom-end"
                    overlay={ChatPopover}
                    rootClose={true}
                  >
                    <span className="private-chat-icon">
                      {numberOfUnreadMessages > 0 && (
                        <div className="notification-card">
                          {numberOfUnreadMessages}
                        </div>
                      )}
                      <div className="navbar-link-message" />
                    </span>
                  </OverlayTrigger>
                )}
                {showNormalRadio && (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom-end"
                    overlay={
                      <Popover id="radio-popover">
                        <Popover.Content>
                          <RadioModal
                            {...{
                              volume,
                              setVolume,
                              title: venue?.radioTitle,
                            }}
                            onEnableHandler={handleRadioEnable}
                            isRadioPlaying={isRadioPlaying}
                          />
                        </Popover.Content>
                      </Popover>
                    }
                    rootClose={true}
                    defaultShow={showRadioOverlay}
                  >
                    <div
                      className={`profile-icon navbar-link-radio ${
                        volume === 0 && "off"
                      }`}
                    />
                  </OverlayTrigger>
                )}

                {showSoundCloudRadio && (
                  <S.RadioTrigger>
                    <div
                      className={`profile-icon navbar-link-radio ${
                        volume === 0 && "off"
                      }`}
                      onClick={toggleShowRadioPopover}
                    />

                    <S.RadioWrapper showRadioPopover={showRadioPopover}>
                      <iframe
                        title="venueRadio"
                        id="sound-cloud-player"
                        scrolling="no"
                        allow="autoplay"
                        src={`https://w.soundcloud.com/player/?url=${radioStation}&amp;start_track=0&amp;single_active=true&amp;show_artwork=false`}
                      />
                    </S.RadioWrapper>
                  </S.RadioTrigger>
                )}

                <OverlayTrigger
                  trigger="click"
                  placement="bottom-end"
                  overlay={ProfilePopover}
                  rootClose={true}
                >
                  <div className="navbar-link-profile">
                    <img
                      src={profileImage}
                      className="profile-icon"
                      alt="avatar"
                      width="40"
                      height="40"
                    />
                  </div>
                </OverlayTrigger>
              </div>
            )}
          </div>
        </div>
      </header>

      <SchedulePageModal isVisible={isEventScheduleVisible} />

      <div
        className={`schedule-dropdown-backdrop ${
          isEventScheduleVisible ? "show" : ""
        }`}
        onClick={hideEventSchedule}
      />

      {venue?.parentId && parentVenue?.name && (
        <div className="back-map-btn">
          <div className="back-icon" />
          <span onClick={backToParentVenue} className="back-link">
            Back{parentVenue ? ` to ${parentVenue.name}` : ""}
          </span>
        </div>
      )}
    </>
  );
};

export default NavBar;
