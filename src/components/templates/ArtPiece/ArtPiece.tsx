import React from "react";
import "./ArtPiece.scss";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import { useSelector } from "hooks/useSelector";
import InformationCard from "components/molecules/InformationCard";
import ChatDrawer from "components/organisms/ChatDrawer";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import Room from "components/organisms/Room";

export const ConvertToEmbeddableUrl = (string: string | undefined) => {
  if (string?.includes("youtube")) {
    return string?.replace("watch?v=", "embed/");
  } else if (string?.includes("vimeo") && !string?.includes("player")) {
    return string?.replace("vimeo.com/", "player.vimeo.com/video/");
  } else {
    return string;
  }
};

const ArtPiece = () => {
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  }));

  const iFrameUrl = ConvertToEmbeddableUrl(
    venue.iframeUrl ?? venue.embedIframeUrl
  );

  return (
    <WithNavigationBar>
      <div className="full-page-container art-piece-container">
        <InformationLeftColumn venueLogoPath={venue ? venue.host.icon : ""}>
          <InformationCard title="About the venue">
            <p className="title-sidebar">{venue.name}.</p>
            <p className="short-description-sidebar">
              {venue.config?.landingPageConfig.subtitle}
            </p>
            <p>{venue.config?.landingPageConfig.description}</p>
          </InformationCard>
        </InformationLeftColumn>
        <div className="content">
          <iframe
            className="youtube-video"
            title="art-piece-video"
            src={iFrameUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="video-chat-wrapper">
            <Room
              roomName={venue.name}
              setUserList={() => null}
              hasChairs={false}
            />
          </div>
        </div>
        <ChatDrawer roomName={venue.name} chatInputPlaceholder="Chat" />
      </div>
      <div className="sparkle-fairie">
        <InformationLeftColumn venueLogoPath={"ambulance"}>
          <InformationCard title="Call the Sparkle Fairies">
            <p className="title-sidebar">{`It's ok to need help!`}</p>
            <p className="short-description-sidebar">
              {`Sparkle Fairies (also knows as "reality rangers") are here to help if you need us. Whether you're feeling down, need a hug, have an issue with someone at the burn or taken too much of something, we're here to help.`}
            </p>
            <p>{`We're discreet, loving and here for you!`}</p>
            <a
              href="https://www.theguardian.com"
              rel="noopener noreferrer"
              target="_blank"
              className="link-button"
            >
              Go to private zoom
            </a>
          </InformationCard>
        </InformationLeftColumn>
      </div>
    </WithNavigationBar>
  );
};

export default ArtPiece;
