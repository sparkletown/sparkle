import React, { CSSProperties, useMemo } from "react";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import { VenueTemplate } from "types/VenueTemplate";

interface AdminVenuePreview {
  venue: WithId<Venue>;
  containerStyle: CSSProperties;
}

export const AdminVenuePreview: React.FC<AdminVenuePreview> = ({
  venue,
  containerStyle,
}) => {
  const templateSpecificListItems = useMemo(() => {
    switch (venue.template) {
      case VenueTemplate.artpiece:
        return (
          <div>
            <span className="title">iFrame URL</span>
            <span className="content">{venue.embedIframeUrl}</span>
          </div>
        );
      default:
        return (
          <div>
            <span className="title">Zoom URL</span>
            <span className="content">{venue.zoomUrl}</span>
          </div>
        );
    }
  }, [venue]);

  return (
    <div className="venue-preview" style={containerStyle}>
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
            src={venue.config.landingPageConfig.coverImageUrl}
            alt="cover"
          />
        </div>
        <div>
          <span className="title">Playa icon</span>
          <span className="content">
            <img
              className="icon"
              src={venue.mapIconImageUrl ?? venue.host.icon}
              alt="icon"
            />
          </span>
        </div>
        <div>
          <span className="title">Camp logo</span>
          <span className="content">
            <img
              className="icon"
              src={venue.mapIconImageUrl ?? venue.host.icon}
              alt="icon"
            />
          </span>
        </div>
        {templateSpecificListItems}
      </div>
    </div>
  );
};
