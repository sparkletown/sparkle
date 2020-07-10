import React from "react";
import SecretPasswordForm from "components/molecules/SecretPasswordForm";
import "./EntranceExperience.scss";
import InformationCard from "components/molecules/InformationCard";
import { updateTheme } from "pages/VenuePage/helpers";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useParams, Redirect } from "react-router-dom";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const EntranceExperience = () => {
  const { venueId } = useParams();

  useFirestoreConnect({
    collection: "venues",
    doc: venueId,
    storeAs: "currentVenue",
  });

  const { venue, user } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
    user: state.user,
  }));

  venue && updateTheme(venue);

  if (!venue) {
    return <>Loading...</>;
  }

  if (user) {
    return <Redirect to={`/venue/${venueId}`} />;
  }

  return (
    <WithNavigationBar>
      <div className="jazz-bar-entrance-experience-container">
        <div className="container">
          <div className="row header">
            <div className="col-lg-4 col-5 band-logo-container">
              <img
                src={venue.host.icon}
                alt="Kansas Smitty's"
                className="band-logo"
              />
            </div>
            <div className="col-lg-4 col-xs-6 secret-password-form-wrapper">
              <SecretPasswordForm />
            </div>
          </div>

          <div className="welcome-message">{venue.welcomeMessage}</div>

          <div className="row video-row">
            <div className="col-lg-6 col-12">
              <iframe
                title="Entrance video"
                className="entrance-video"
                src={venue.entranceVideoIframeUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="col-lg-6 col-12 decscription-items-container">
              {venue.descriptionItems.map((descriptionItem: any) => (
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
          <InformationCard
            className="event-card"
            title="Buy tickets on EventBrite"
          >
            <a
              href={venue.eventBriteUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <button
                id={`eventbrite-${venue.name}`}
                type="button"
                className="btn btn-primary"
              >
                Buy Tickets
              </button>
            </a>
          </InformationCard>
          {venue.events.map((event: any) => (
            <InformationCard
              className="event-card"
              title={event.date}
              key={event.date}
            >
              <div className="event-description">{event.description}</div>
            </InformationCard>
          ))}
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default EntranceExperience;
