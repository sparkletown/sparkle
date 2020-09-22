import React, { useMemo, useEffect, useState } from "react";
import { FirebaseReducer, useFirestoreConnect } from "react-redux-firebase";
import { Venue, VenuePlacementState } from "types/Venue";
import "./VenuePreview.scss";
import { BURN_VENUE_TEMPLATES } from "settings";
import UserList from "components/molecules/UserList";
import { useSelector } from "hooks/useSelector";
import { venueInsideUrl } from "utils/url";
import { WithId } from "utils/id";
import { VenueTemplate } from "types/VenueTemplate";
import { peopleAttending, peopleByLastSeenIn } from "utils/venue";
import firebase from "firebase/app";
import "../../molecules/OnlineStats/OnlineStats.scss";
import VenueInfoEvents from "../../molecules/VenueInfoEvents/VenueInfoEvents";
import img from "./img/pickspace-thumbnail_camp.png";
// import { playaAddress } from "utils/address";
import { Modal } from "react-bootstrap";

interface VenuePreviewProps {
  user: FirebaseReducer.AuthState;
  venue: WithId<Venue>;
  allowHideVenue: boolean;
}

const nowSeconds = new Date().getTime() / 1000;

const getLink = (venue: WithId<Venue>) => {
  let urlLink: string | undefined;
  let targetLink: string = "";
  switch (venue.template) {
    case VenueTemplate.themecamp:
      urlLink = venueInsideUrl(venue.id);
      break;
    case VenueTemplate.artpiece:
      urlLink = venueInsideUrl(venue.id);
      break;
    case VenueTemplate.zoomroom:
      urlLink = venue.zoomUrl?.includes("http")
        ? venue.zoomUrl
        : "//" + venue.zoomUrl;
      targetLink = "_blank";
      break;
    default:
      urlLink = venueInsideUrl(venue.id);
  }
  return { urlLink, targetLink };
};

const VenuePreview: React.FC<VenuePreviewProps> = ({
  user,
  venue,
  allowHideVenue,
}) => {
  const partygoers = useSelector((state) => state.firestore.ordered.partygoers);

  const [showHiddenModal, setShowHiddenModal] = useState(false);

  const users: typeof partygoers = useMemo(
    () => peopleAttending(peopleByLastSeenIn(partygoers), venue) ?? [],
    [partygoers, venue]
  );

  useFirestoreConnect([
    {
      collection: "venues",
      doc: venue.id,
      subcollections: [{ collection: "events" }],
      where: [["start_utc_seconds", ">=", nowSeconds]],
      orderBy: ["start_utc_seconds", "asc"],
      storeAs: "venueEvents",
    },
  ]);

  const templateName = BURN_VENUE_TEMPLATES.find(
    (t) => t.template === venue.template
  )?.name;

  let joinButtonText = "Enter the experience";
  switch (venue.template) {
    case VenueTemplate.themecamp:
      joinButtonText = "Enter the camp";
      break;
    case VenueTemplate.artpiece:
      joinButtonText = "View the art";
      break;
  }

  const hideVenue = async () => {
    await firebase.functions().httpsCallable("venue-adminHideVenue")(venue);
    setShowHiddenModal(true);
  };

  const isHideable =
    venue.placement?.state === VenuePlacementState.SelfPlaced ||
    venue.placement?.state === VenuePlacementState.AdminPlaced;

  let hideButtonText = "MOOP this venue";
  switch (venue.template) {
    case VenueTemplate.themecamp:
      hideButtonText = "MOOP this camp";
      break;
    case VenueTemplate.artpiece:
      hideButtonText = "MOOP this art";
      break;
  }

  const venueHiddenText = "Returned to dust! Thanks for your creativity!";

  const { urlLink, targetLink } = getLink(venue);

  const [eventsNow, setEventsNow] = useState<firebase.firestore.DocumentData[]>(
    []
  );
  const [eventsFuture, setEventsFuture] = useState<
    firebase.firestore.DocumentData[]
  >([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection(`venues/${venue.id}/events`)
      .get()
      .then(function (array) {
        const currentEvents = array.docs
          .map((doc) => doc.data())
          .filter(
            (event) =>
              event.start_utc_seconds < nowSeconds &&
              event.start_utc_seconds + event.duration_minutes * 60 > nowSeconds
          );
        setEventsNow(currentEvents);
      });
  }, [venue]);

  useEffect(() => {
    firebase
      .firestore()
      .collection(`venues/${venue.id}/events`)
      .get()
      .then(function (array) {
        const futureEvents = array.docs
          .map((doc) => doc.data())
          .filter((event) => event.start_utc_seconds > nowSeconds)
          .sort((a, b) => a.start_utc_seconds - b.start_utc_seconds);
        setEventsFuture(futureEvents);
      });
  }, [venue]);

  return (
    <>
      <div className="container playa-venue-preview-container">
        <div
          className="header"
          style={{
            background: `linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.8) 2%,
                        rgba(0, 0, 0, 0) 98%
                      ), url(${
                        venue.config?.landingPageConfig?.bannerImageUrl ??
                        venue.config?.landingPageConfig?.coverImageUrl
                      }`,
            backgroundSize: "cover",
          }}
        >
          <img
            src={
              venue.template === "zoomroom"
                ? "/pickspace-thumbnail_zoom.png"
                : venue.template === "themecamp"
                ? "/pickspace-thumbnail_camp.png"
                : "/pickspace-thumbnail_art.png"
            }
            alt="pic of camp/artpiece/zoom"
            className="img-venue"
          />
          <div className="title-container">
            <img
              className="host-icon"
              src={venue.host.icon}
              alt={`${venue.name} host`}
            />
            <div className="title-text">
              <h2>{venue.name}</h2>
              <p className="subtitle">
                {venue.config?.landingPageConfig?.subtitle}
              </p>
              {venue.placement?.addressText && (
                <p className="subtitle">
                  City address: {venue.placement?.addressText}
                </p>
              )}
              {venue.adultContent && (
                <p className="subtitle red">
                  Venue has restricted entry to adults aged 18+
                </p>
              )}
              <p className="template-name">{templateName}</p>
              <a
                className="btn btn-primary join-button"
                href={urlLink}
                target={targetLink}
                rel="noopener noreferrer"
              >
                {joinButtonText}
              </a>
              {allowHideVenue && isHideable && (
                <button
                  className="btn btn-primary btn-danger hide-button"
                  onClick={hideVenue}
                >
                  {hideButtonText}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="user-list-container">
          <UserList
            users={users}
            isAudioEffectDisabled
            activity={`in this ${templateName ?? "experience"}`}
          />
        </div>
        <div className="description">
          {venue.config?.landingPageConfig?.description}
        </div>
        {/* {venue.placement?.x && venue.placement?.y && (
          <div className="address">
            <strong>Address on playa:</strong>{" "}
            {playaAddress(venue.placement.x, venue.placement.y)}
          </div>
        )} */}
        <VenueInfoEvents
          eventsNow={eventsNow}
          venue={venue}
          showButton={false}
          futureEvents={false}
          joinNowButton
        />
        <VenueInfoEvents
          eventsNow={eventsFuture}
          venue={venue}
          showButton={false}
          futureEvents={true}
          joinNowButton
        />
      </div>
      <Modal show={showHiddenModal} onHide={() => setShowHiddenModal(false)}>
        <div className="venue-hidden-content">
          <p>{venueHiddenText}</p>
          <button
            type="button"
            className="btn btn-primary btn-block btn-centered"
            onClick={() => setShowHiddenModal(false)}
          >
            OK
          </button>
        </div>
      </Modal>
    </>
  );
};

export default VenuePreview;
