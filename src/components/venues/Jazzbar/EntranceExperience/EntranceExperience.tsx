import React from "react";
import "./EntranceExperience.scss";
import { updateTheme } from "pages/VenuePage/helpers";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useParams, useHistory } from "react-router-dom";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import InformationCard from "components/molecules/InformationCard";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Venue } from "pages/VenuePage/VenuePage";
import { User as FUser } from "firebase/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { VenueEvent } from "types/VenueEvent";
import EventPaymentButton from "components/molecules/EventPaymentButton";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import getQueryParameters from "utils/getQueryParameters";
import { RouterLocation } from "types/RouterLocation";
import CheckPaymentIsNeeded from "components/molecules/CheckPaymentIsNeeded";

interface PropsType {
  location: RouterLocation;
}

const JazzbarEntranceExperience: React.FunctionComponent<PropsType> = ({
  location,
}) => {
  const { venueId } = useParams();
  dayjs.extend(advancedFormat);

  useConnectCurrentVenue();

  useFirestoreConnect({
    collection: "venues",
    doc: venueId,
    subcollections: [{ collection: "events" }],
    storeAs: "venueEvents",
    orderBy: ["start_utc_seconds", "asc"],
  });

  const { venue, venueEvents, venueRequestStatus, user } = useSelector(
    (state: any) => ({
      venue: state.firestore.data.currentVenue,
      user: state.user,
      venueRequestStatus: state.firestore.status.requested.currentVenue,
      venueEvents: state.firestore.ordered.venueEvents,
    })
  ) as {
    venue: Venue;
    venueEvents: VenueEvent[];
    venueRequestStatus: boolean;
    user: FUser;
  };

  const { eventId, redirectTo } = getQueryParameters(location.search);

  venue && updateTheme(venue);

  const history = useHistory();

  if (user && venueId && eventId && redirectTo === "payment") {
    return <CheckPaymentIsNeeded eventId={eventId} venueId={venueId} />;
  }

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (!venue) {
    return <>Loading...</>;
  }

  const nextVenueEventId = venueEvents?.[0]?.id;
  const redirectToSignUpFlow = (eventId: string) => {
    history.push(
      `/account/register?venueId=${venueId}&eventId=${eventId}&redirectTo=payment`
    );
  };

  return (
    <>
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
          <div className="row">
            <div className="col-lg-6 col-12 venue-presentation">
              <iframe
                title="entrance video"
                width="100%"
                height="300"
                className="youtube-video"
                src={venue.config.landingPageConfig.videoIframeUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
              />
              {venue.config.landingPageConfig.presentation &&
                venue.config.landingPageConfig.presentation.map(
                  (paragraph: string, index: number) => (
                    <p
                      key={`venue-presentation-paragraph-${index}`}
                      className="presentation-paragraph"
                    >
                      {paragraph}
                    </p>
                  )
                )}
              <div>
                {venue.config.landingPageConfig.checkList &&
                  venue.config.landingPageConfig.checkList.map(
                    (checkListItem: string, index: number) => (
                      <div
                        key={`checklist-item-${index}`}
                        className="checklist-item"
                      >
                        <div className="check-icon-container">
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div>{checkListItem}</div>
                      </div>
                    )
                  )}
              </div>
            </div>
            <div className="col-lg-6 col-12 oncoming-events">
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
                        {`${dayjs(startingDate).format(
                          "ddd MMMM Do: Ha"
                        )}/${dayjs(endingDate).format("Ha")}`}
                      </div>
                      <div className="event-description">
                        {venueEvent.description}
                        {venueEvent.descriptions?.map((d) => (
                          <p>{d}</p>
                        ))}
                      </div>
                      {isNextVenueEvent && (
                        <div className="button-container">
                          {user ? (
                            <EventPaymentButton
                              eventId={venueEvent.id}
                              venueId={venueId}
                            />
                          ) : (
                            <button
                              className="btn btn-primary buy-tickets-button"
                              onClick={() =>
                                redirectToSignUpFlow(venueEvent.id)
                              }
                            >
                              Buy tickets
                            </button>
                          )}
                        </div>
                      )}
                    </InformationCard>
                  );
                })}
            </div>
          </div>
        </div>
      </WithNavigationBar>
    </>
  );
};

export default JazzbarEntranceExperience;
