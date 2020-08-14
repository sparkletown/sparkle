import React, { useMemo } from "react";
import { Venue } from "types/Venue";
import "./VenuePreview.scss";
import { BURN_VENUE_TEMPLATES } from "settings";
import UserList from "components/molecules/UserList";
import { useSelector } from "hooks/useSelector";
import { venueInsideUrl } from "utils/url";
import { WithId } from "utils/id";
import { AnyVenue } from "types/Firestore";
import { CampVenue } from "types/CampVenue";
import { VenueTemplate } from "types/VenueTemplate";

interface VenuePreviewProps {
  venue: WithId<Venue>;
}

const hasRooms = (venue: AnyVenue): venue is CampVenue => "rooms" in venue;

const VenuePreview: React.FC<VenuePreviewProps> = ({ venue }) => {
  const partygoers = useSelector((state) => state.firestore.ordered.partygoers);

  const users = useMemo(
    () =>
      partygoers?.filter((p) =>
        [
          venue.name,
          ...(hasRooms(venue) ? venue.rooms?.map((r) => r.title) : []),
        ].includes(p.lastSeenIn)
      ),
    [partygoers, venue]
  );

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
                      ), url(${venue.config?.landingPageConfig?.coverImageUrl}`,
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
              <p className="template-name">{templateName}</p>
              <a
                className="btn btn-primary join-button"
                href={venueInsideUrl(venue.id)}
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
        <div className="schedule-container">
          <h4>Right now</h4>
          <p className="schedule">
            We'll put this in later but ths is where the schedule will go
          </p>
        </div>
      </div>
    </>
  );
};

export default VenuePreview;
