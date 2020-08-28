import React from "react";
import firebase from "firebase/app";
import "./VenueInfoEvents.scss";
import { AnyVenue } from "types/Firestore";
import { WithId } from "utils/id";
import { venuePlayaPreviewUrl } from "utils/url";
import { EventDisplay } from "../EventDisplay/EventDisplay";
import "../EventDisplay/EventDisplay.scss";

interface PropsType {
  eventsNow: firebase.firestore.DocumentData[];
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
              >{`What's next`}</span>
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
                        joinNowButton={joinNowButton}
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
            <div className="title-container">
              <img src="/sparkle-icon.png" alt="sparkle icon" />
              <span
                style={{ fontSize: 20, fontWeight: "bold", color: "yellow" }}
              >{`What's on now`}</span>
            </div>
            <div className="description-container">
              {eventsNow.length > 0 ? (
                <>
                  <div className="events-list">
                    <EventDisplay
                      event={eventsNow[0]}
                      venue={venue}
                      joinNowButton={joinNowButton}
                    />
                  </div>
                </>
              ) : (
                <div className="yellow">No events currently</div>
              )}
            </div>
          </>
        )}
      </div>
      {showButton && (
        <div className="centered-flex">
          <button
            className="btn btn-primary"
            // @debt would be nice not to refresh the page
            onClick={() =>
              (window.location.href = venuePlayaPreviewUrl(venue.id))
            }
          >
            View on Playa
          </button>
        </div>
      )}
    </div>
  );
};

export default VenueInfoEvents;
