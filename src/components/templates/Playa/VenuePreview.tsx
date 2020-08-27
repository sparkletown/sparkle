import React, { useMemo, useEffect, useState } from "react";
import { FirebaseReducer, useFirestoreConnect } from "react-redux-firebase";
import { Venue } from "types/Venue";
import "./VenuePreview.scss";
import { BURN_VENUE_TEMPLATES } from "settings";
import UserList from "components/molecules/UserList";
import { useSelector } from "hooks/useSelector";
import { venueInsideUrl } from "utils/url";
import { WithId } from "utils/id";
import { VenueTemplate } from "types/VenueTemplate";
import { peopleAttending } from "utils/venue";
import firebase from "firebase/app";
import "../../molecules/OnlineStats/OnlineStats.scss";
import VenueInfoEvents from "../../molecules/VenueInfoEvents/VenueInfoEvents";

interface VenuePreviewProps {
  user: FirebaseReducer.AuthState;
  venue: WithId<Venue>;
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
  }
  return { urlLink, targetLink };
};

const VenuePreview: React.FC<VenuePreviewProps> = ({ user, venue }) => {
  const partygoers = useSelector((state) => state.firestore.ordered.partygoers);

  const users: typeof partygoers = useMemo(
    () => peopleAttending(partygoers, venue) ?? [],
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
              <p className="template-name">{templateName}</p>
              <a
                className="btn btn-primary join-button"
                href={urlLink}
                target={targetLink}
                rel="noopener noreferrer"
              >
                {joinButtonText}
              </a>
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
        <VenueInfoEvents
          eventsNow={eventsNow}
          venue={venue}
          showButton={false}
          //futureEvents={false}
        />
        <VenueInfoEvents
          eventsNow={eventsFuture}
          venue={venue}
          showButton={false}
          futureEvents={true}
        />
      </div>
    </>
  );
};

export default VenuePreview;
