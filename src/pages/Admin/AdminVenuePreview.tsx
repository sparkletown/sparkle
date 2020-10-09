import React, { CSSProperties, useMemo, useState, useEffect } from "react";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import { VenueTemplate } from "types/VenueTemplate";
import { CampVenue } from "types/CampVenue";
import { CampContainer } from "pages/Account/Venue/VenueMapEdition";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { PLAYA_IMAGE, PLAYA_VENUE_STYLES } from "settings";
import { AdminVenueRoomsList } from "./AdminVenueRoomsList";
import firebase from "firebase/app";
import { PLAYA_VENUE_ID } from "settings";

interface AdminVenuePreview {
  venue: WithId<Venue>;
  containerStyle: CSSProperties;
}

export const AdminVenuePreview: React.FC<AdminVenuePreview> = ({
  venue,
  containerStyle,
}) => {
  const [bannerMessage, setBannerMessage] = useState("");
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    setBannerMessage(venue?.bannerMessage || "");
  }, [venue]);

  const updateBanner = (message: string | null) => {
    const params = {
      venueId: PLAYA_VENUE_ID,
      bannerMessage: message ? message : "",
    };
    firebase
      .functions()
      .httpsCallable("venue-adminUpdateBannerMessage")(params)
      .catch((e) => setError(e.toString()));
  };

  const setBanner = () => updateBanner(bannerMessage);
  // const removeBanner = () => updateBanner("");

  const templateSpecificListItems = useMemo(() => {
    switch (venue.template) {
      case VenueTemplate.artpiece:
        return (
          <>
            <div>
              <span className="title">iFrame URL: </span>
              <span className="content">
                <a href={venue.embedIframeUrl}>{venue.embedIframeUrl}</a>
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
                src={ConvertToEmbeddableUrl(venue.embedIframeUrl)}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
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
      case VenueTemplate.themecamp:
        const campVenue = venue as WithId<CampVenue>;
        return (
          <div
            className="content-group"
            style={{ padding: "0px", margin: "0px", position: "relative" }}
          >
            <div className="admin-camp-venue-crumb">
              {campVenue.name + " Map"}
            </div>
            <CampContainer
              interactive={false}
              resizable
              coordinatesBoundary={100}
              iconsMap={{}}
              backgroundImage={venue.mapBackgroundImageUrl || PLAYA_IMAGE}
              iconImageStyle={PLAYA_VENUE_STYLES.iconImage}
              draggableIconImageStyle={PLAYA_VENUE_STYLES.draggableIconImage}
              venue={campVenue}
            />
          </div>
        );
      default:
        return;
    }
  }, [venue]);

  // const venueTypeText =
  //   venue.template === VenueTemplate.themecamp
  //     ? "Camp Info:"
  //     : venue.template === VenueTemplate.artpiece
  //       ? "Art Piece Info:"
  //       : "Experience Info:";

  return (
    <div style={containerStyle}>
      <div
        className="announcement-container"
        style={{
          top: "0px",
          backgroundColor: "#1A1D24",
          width: "540px",
          display: "flex",
        }}
      >
        <input
          type="text"
          value={bannerMessage}
          onChange={(e) => {
            setError(null);
            setBannerMessage(e.target.value);
          }}
          placeholder="Live announcement or update"
        />
        {error && <span className="error">{error}</span>}
        <button
          className="btn btn-primary"
          type="submit"
          style={{ backgroundColor: "#6f43ff", backgroundImage: "none" }}
          onClick={setBanner}
        >
          Send
        </button>
      </div>
      <div className="announcement-header">
        <img
          className="icon"
          src={
            venue.config?.landingPageConfig.bannerImageUrl ??
            venue.config?.landingPageConfig.coverImageUrl
          }
          alt="icon"
        />
      </div>
      <div className="announcement-heading-group">
        <div style={{ padding: "5px" }}>
          <h1 className="content">{venue.name}</h1>
        </div>
        <div style={{ padding: "5px" }}>
          <span className="content">
            {venue.config?.landingPageConfig.subtitle}
          </span>
        </div>
        <div style={{ padding: "5px" }}>
          <span className="content">
            {venue.config?.landingPageConfig.description}
          </span>
        </div>
      </div>
      <div className="venue-preview">{templateSpecificListItems}</div>
      <AdminVenueRoomsList venue={venue} />
    </div>
  );
};
