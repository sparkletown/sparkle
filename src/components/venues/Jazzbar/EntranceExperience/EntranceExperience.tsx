import React from "react";
// import SecretPasswordForm from "components/molecules/SecretPasswordForm";
import "./EntranceExperience.scss";
// import InformationCard from "components/molecules/InformationCard";
import { updateTheme } from "pages/VenuePage/helpers";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useParams, Redirect } from "react-router-dom";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import InformationCard from "components/molecules/InformationCard";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Venue } from "pages/VenuePage/VenuePage";
import { User } from "types/User";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface VenueEvent {
  id: string;
  name: string;
  start_utc_seconds: number;
  description: string;
  duration_minutes: number;
}

const JazzbarEntranceExperience = () => {
  const { venueId } = useParams();
  dayjs.extend(advancedFormat);

  useFirestoreConnect({
    collection: "venues",
    doc: venueId,
    storeAs: "currentVenue",
  });

  useFirestoreConnect({
    collection: "venues",
    doc: venueId,
    subcollections: [{ collection: "events" }],
    storeAs: "venueEvents",
    orderBy: ["start_utc_seconds", "asc"],
  });

  const { venue, user, venueEvents } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
    user: state.user,
    venueEvents: state.firestore.ordered.venueEvents,
  })) as { venue: Venue; user: User; venueEvents: VenueEvent[] };

  venue && updateTheme(venue);

  if (!venue) {
    return <>Loading...</>;
  }

  if (user) {
    return <Redirect to={`/venue/${venueId}`} />;
  }

  const nextVenueEventId = venueEvents && venueEvents[0].id;

  return (
    <WithNavigationBar>
      <div className="container venue-entrance-experience-container">
        <div
          className="header"
          style={{
            background: `linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8) 2%,
            rgba(0, 0, 0, 0) 98%
          ), url(${venue.config.landingPageConfig.coverImageUrl}`,
            backgroundSize: "cover",
          }}
        >
          <div className="venue-host">
            <div className="host-icon-container">
              <img className="host-icon" src={venue.host.icon} alt="host" />
            </div>
            <div className="title">{venue.name}</div>
            <div className="subtitle">
              {venue.config.landingPageConfig.subtitle}
            </div>
          </div>
        </div>
        <div className="col oncoming-events">
          <div className="upcoming-gigs-title">Upcoming gigs</div>
          {venueEvents &&
            venueEvents.map((venueEvent: VenueEvent) => {
              const startingDate = new Date(
                venueEvent.start_utc_seconds * 1000
              );
              const endingDate = new Date(
                (venueEvent.start_utc_seconds +
                  60 * venueEvent.duration_minutes) *
                  1000
              );
              const isNextVenueEvent = venueEvent.id === nextVenueEventId;
              return (
                <InformationCard
                  title={venueEvent.name}
                  key={venueEvent.id}
                  className={`${!isNextVenueEvent ? "disabled" : ""}`}
                >
                  <div className="date">
                    {`${dayjs(startingDate).format("ddd MMMM Do - Ha")}/${dayjs(
                      endingDate
                    ).format("Ha")}`}
                  </div>
                  <div className="event-description">
                    {venueEvent.description}
                  </div>
                  {isNextVenueEvent && (
                    <div className="button-container">
                      <button className="btn btn-primary buy-tickets-button">
                        Buy tickets
                      </button>
                    </div>
                  )}
                </InformationCard>
              );
            })}
        </div>
      </div>
      {/* <div className="jazz-bar-entrance-experience-container">
        <div className="container">
          <div className="row header">
            <div className="col-lg-4 col-5 band-logo-container">
              <img
                src={venue?.host?.icon}
                alt="Kansas Smitty's"
                className="band-logo"
              />
            </div>
            <div className="col-lg-4 col-xs-6 secret-password-form-wrapper">
              <SecretPasswordForm />
            </div>
          </div>

          <div className="welcome-message">
            {venue.config.landingPageConfig.welcomeMessage}
          </div>

          <div className="row video-row">
            <div className="col-lg-6 col-12">
              <iframe
                title="Entrance video"
                className="entrance-video"
                src={venue.config.landingPageConfig.videoIframeUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="col-lg-6 col-12 decscription-items-container">
              {venue.descriptionItems &&
                venue.descriptionItems.map((descriptionItem: any) => (
                  <div key={descriptionItem.id} className="description-item">
                    <div className="check-icon-container">
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <div>{descriptionItem.text}</div>
                  </div>
                ))}
            </div>
          </div>
          <div className="upcoming-gigs-title">Upcoming gigs:</div>
          {venue.config.landingPageConfig.eventbriteEventId && (
            <InformationCard
              className="event-card"
              title="Buy tickets on EventBrite"
            >
              <EventbriteButton
                ebEventId={venue.eventbriteEventId}
                className="eventbrite-widget"
              >
                <button
                  id={`eventbrite-${venue.name}`}
                  type="button"
                  className="btn btn-primary"
                >
                  Buy Tickets
                </button>
              </EventbriteButton>
            </InformationCard>
          )}
          {venue.events &&
            venue.events.map((event: any) => (
              <InformationCard
                className="event-card"
                title={event.date}
                key={event.date}
              >
                <div className="event-description">{event.description}</div>
              </InformationCard>
            ))}
        </div>
      </div> */}
    </WithNavigationBar>
  );
};

export default JazzbarEntranceExperience;
