import React from "react";
import "./VenueInfoEvents.scss";
import { AnyVenue } from "types/Firestore";
import { WithId } from "utils/id";
import { openUrl, venueInsideUrl } from "utils/url";
import { VenueEvent } from "types/VenueEvent";
import { EventDisplay } from "../EventDisplay/EventDisplay";
import "../EventDisplay/EventDisplay.scss";
import { PLAYA_VENUE_NAME } from "settings";

interface PropsType {
  eventsNow: VenueEvent[];
  venue: WithId<AnyVenue>;
  showButton: boolean;
  futureEvents?: boolean;
  joinNowButton: boolean;
}

const VenueInfoEvents: React.FunctionComponent<PropsType> = ({
  eventsNow,
  venue,
  showButton,
  futureEvents,
  joinNowButton,
}) => {
  return (
    <div>
      <div>
        {futureEvents ? (
          <>
            <div className="title-container">
              <img src="/sparkle-icon.png" alt="sparkle icon" />
              <span
                style={{ fontSize: 20, fontWeight: "bold", color: "yellow" }}
              >
                What&apos;s next
              </span>
            </div>
            <div className="description-container">
              {eventsNow.length > 0 ? (
                <div className="events-list events-list_monday">
                  {eventsNow &&
                    eventsNow.map((event, idx) => (
                      <EventDisplay
                        key={event.name + idx}
                        event={event}
                        venue={venue}
                      />
                    ))}
                </div>
              ) : (
                <span className="yellow">No future events planned</span>
              )}
            </div>
          </>
        ) : (
          <>
            {eventsNow.length ? (
              <div className="whatson-container">
                <div className="whatson-title-container">
                  What&apos;s on now
                </div>
                <div className="whatson-description-container">
                  {eventsNow.map((event, idx) => (
                    <React.Fragment key={idx}>
                      <div className="whatson-description-container-title">
                        {event.name}
                      </div>
                      <div className="whatson-description-container-description">
                        {event.description}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      {showButton && (
        <div className="centered-flex">
          <button
            className={`btn ${
              eventsNow.length ? "btn-primary" : "btn-secondary"
            } btn-block`}
            // @debt would be nice not to refresh the page
            onClick={() => openUrl(venueInsideUrl(venue.id))}
          >
            {eventsNow.length ? "Join now" : `View on ${PLAYA_VENUE_NAME}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default VenueInfoEvents;
