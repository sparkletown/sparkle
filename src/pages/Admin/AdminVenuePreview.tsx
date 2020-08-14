import React, { CSSProperties, useMemo } from "react";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import { VenueTemplate } from "types/VenueTemplate";
import { useQuery } from "hooks/useQuery";
import { isCampVenue } from "types/CampVenue";

interface AdminVenuePreview {
  venue: WithId<Venue>;
  containerStyle: CSSProperties;
}

export const AdminVenuePreview: React.FC<AdminVenuePreview> = ({
  venue,
  containerStyle,
}) => {
  const queryParams = useQuery();
  const queryRoomIndexString = queryParams.get("roomIndex");
  const queryRoomIndex = queryRoomIndexString
    ? parseInt(queryRoomIndexString)
    : undefined;

  const room =
    isCampVenue(venue) && typeof queryRoomIndex !== "undefined"
      ? venue.rooms[queryRoomIndex]
      : undefined;

  const templateSpecificListItems = useMemo(() => {
    switch (venue.template) {
      case VenueTemplate.artpiece:
        return (
          <div>
            <span className="title">iFrame URL</span>
            <span className="content">
              <a href={venue.embedIframeUrl}>{venue.embedIframeUrl}</a>
            </span>
          </div>
        );
      case VenueTemplate.zoomroom:
        return (
          <div>
            <span className="title">Zoom URL</span>
            <span className="content">
              <a href={venue.zoomUrl} target="_blank" rel="noopener noreferrer">
                {venue.zoomUrl}
              </a>
            </span>
          </div>
        );
      default:
        return;
    }
  }, [venue]);

  return (
    <div style={containerStyle}>
      <div className="venue-preview">
        <h3 style={{ textAlign: "center" }}>
          Your <b>Experience</b> Info
        </h3>
        <div className="heading-group">
          <div>
            <span className="title">Name:</span>
            <span className="content">{venue.name}</span>
          </div>
          <div>
            <span className="title">Short description:</span>
            <span className="content">
              {venue.config.landingPageConfig.subtitle}
            </span>
          </div>
          <div>
            <span className="title">Long description:</span>
            <span className="content">
              {venue.config.landingPageConfig.description}
            </span>
          </div>
        </div>
        <div className="content-group">
          <div>
            <span className="title">Banner photo</span>
            <img
              className="banner"
              src={
                venue.config.landingPageConfig.bannerImageUrl ??
                venue.config.landingPageConfig.coverImageUrl
              }
              alt="cover"
            />
          </div>
          <div>
            <span className="title">Playa icon</span>
            <span className="content">
              <img className="icon" src={venue.mapIconImageUrl} alt="icon" />
            </span>
          </div>
          <div>
            <span className="title">Camp logo</span>
            <span className="content">
              <img className="icon" src={venue.host.icon} alt="icon" />
            </span>
          </div>
          {templateSpecificListItems}
        </div>
      </div>
      {room && (
        <div className="venue-preview">
          <div>
            <h3 style={{ textAlign: "center" }}>
              Your <b>Room</b>
            </h3>
            <div className="heading-group">
              <div>
                <span className="title">title:</span>
                <span className="content">{room.title}</span>
              </div>
              <div>
                <span className="title">subtitle:</span>
                <span className="content">{room.subtitle}</span>
              </div>
              <div>
                <span className="title">About:</span>
                <span className="content">{room.about}</span>
              </div>
              <div>
                <span className="title">URL:</span>
                <span className="content">{room.url}</span>
              </div>
            </div>
            <div className="content-group">
              <div>
                <span className="title">Image Icon photo</span>
                <img className="banner" src={room.image_url} alt="room icon" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
