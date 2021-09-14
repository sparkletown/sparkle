import React, { CSSProperties, useMemo } from "react";
import { useCss } from "react-use";
import classNames from "classnames";
import { format } from "date-fns";

import { DEFAULT_VENUE_BANNER, IFRAME_ALLOW } from "settings";

import { AnyVenue, PartyMapVenue, VenueTemplate } from "types/venues";

import { convertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { WithId } from "utils/id";

import { useValidImage } from "hooks/useCheckImage";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { AdminVenueRoomsList } from "./AdminVenueRoomsList";
import MapPreview from "./MapPreview";

export interface AdminVenuePreviewProps {
  venue: WithId<AnyVenue>;
  containerStyle: CSSProperties;
}

// @debt Refactor this into settings, or types/templates, or similar?
const infoTextByVenue: { [key: string]: string } = {
  [VenueTemplate.themecamp]: "Camp Info:",
  [VenueTemplate.artpiece]: "Art Piece Info:",
  [VenueTemplate.partymap]: "Party Map Info:",
};

export const AdminVenuePreview: React.FC<AdminVenuePreviewProps> = ({
  venue,
  containerStyle,
}) => {
  const templateSpecificListItems = useMemo(() => {
    switch (venue.template) {
      case VenueTemplate.artpiece:
        return (
          <>
            <div>
              <span className="title">iframe URL: </span>
              <span className="content">
                <a href={venue.iframeUrl}>{venue.iframeUrl}</a>
              </span>
            </div>
            <div className="title" style={{ marginTop: 10 }}>
              {" "}
              This is a preview of your art piece:
            </div>
            <p>(Make sure the URL provided is embeddable)</p>
            <div className="iframe-preview-container">
              <iframe
                className="iframe-preview"
                title="art-piece-video"
                src={convertToEmbeddableUrl({ url: venue.iframeUrl })}
                frameBorder="0"
                allow={IFRAME_ALLOW}
                allowFullScreen
              />
            </div>
          </>
        );
      case VenueTemplate.zoomroom:
        return (
          <div>
            <span className="title">URL</span>
            <span className="content">
              <a href={venue.zoomUrl} target="_blank" rel="noopener noreferrer">
                {venue.zoomUrl}
              </a>
            </span>
          </div>
        );
      case VenueTemplate.partymap:
      case VenueTemplate.animatemap:
      case VenueTemplate.themecamp:
        const partyMapVenue = venue as WithId<PartyMapVenue>;
        return (
          <div className="content-group" style={{ padding: "5px" }}>
            <span className="title" style={{ fontSize: "20px" }}>
              This is a preview of your Space
            </span>
            <MapPreview
              isEditing
              venueId={partyMapVenue.id}
              venueName={partyMapVenue.name}
              mapBackground={partyMapVenue.mapBackgroundImageUrl}
              rooms={partyMapVenue.rooms ?? []}
            />
          </div>
        );
      default:
        return;
    }
  }, [venue]);

  const venueTypeText = infoTextByVenue[venue.template] ?? "Experience Info:";

  const [validBannerImageUrl] = useValidImage(
    venue.config?.landingPageConfig.bannerImageUrl ??
      venue.config?.landingPageConfig.coverImageUrl,
    DEFAULT_VENUE_BANNER
  );

  const imageVars = useCss({
    background:
      validBannerImageUrl === DEFAULT_VENUE_BANNER
        ? validBannerImageUrl
        : `url(${validBannerImageUrl})`,
  });

  const imageClasses = classNames("icon", imageVars);

  return (
    <div style={containerStyle}>
      <div className="venue-preview">
        <h4
          className="italic"
          style={{ textAlign: "center", fontSize: "30px" }}
        >
          {venueTypeText} {venue.name}
        </h4>
        <div className="heading-group">
          <div style={{ padding: "5px" }}>
            <span className="title" style={{ fontSize: "18px" }}>
              Name:
            </span>
            <span className="content">{venue.name}</span>
          </div>
          <div style={{ padding: "5px" }}>
            <span className="title" style={{ fontSize: "18px" }}>
              Short description:
            </span>
            <span className="content">
              {venue.config?.landingPageConfig.subtitle}
            </span>
          </div>
          <div
            style={{ padding: "5px", display: "flex", alignItems: "center" }}
          >
            <span
              className="title"
              style={{
                fontSize: "18px",
                marginBottom: "1rem",
                marginTop: 0,
              }}
            >
              Long description:
            </span>
            <RenderMarkdown
              text={venue.config?.landingPageConfig.description}
            />
          </div>

          <div>
            <span className="title">Created At:</span>
            {venue.createdAt && format(venue.createdAt, "yyyy-MM-dd HH:mm:ss")}
          </div>
          <div>
            <span className="title">Updated At:</span>
            {venue.updatedAt && format(venue.updatedAt, "yyyy-MM-dd HH:mm:ss")}
          </div>
        </div>
        <div className="content-group" style={{ display: "flex" }}>
          <div style={{ width: "150px" }}>
            <div className="title" style={{ width: "150px" }}>
              Banner photo
            </div>
            <div className="content">
              <div className={imageClasses} />
            </div>
          </div>
          {/* Removed as unnecessary. https://github.com/sparkletown/internal-sparkle-issues/issues/710  */}
          {/* <div style={{ width: "150px" }}>
            <div className="title" style={{ width: "150px" }}>
              {PLAYA_VENUE_NAME} icon
            </div>
            <div className="content">
              <img className="icon" src={venue.mapIconImageUrl} alt="icon" />
            </div>
          </div> */}
          <div style={{ width: "150px" }}>
            <div className="title" style={{ width: "150px" }}>
              Square logo
            </div>
            <div className="content">
              <img className="icon" src={venue.host?.icon} alt="icon" />
            </div>
          </div>
        </div>
        {templateSpecificListItems}
      </div>
      <AdminVenueRoomsList venue={venue} />
    </div>
  );
};
