import React from "react";
import "./ArtPiece.scss";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import { useSelector } from "hooks/useSelector";
import InformationCard from "components/molecules/InformationCard";
import ChatDrawer from "components/organisms/ChatDrawer";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import Room from "components/organisms/Room";

const ConvertToEmbeddableUrl = (string: string | undefined) => {
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
            <p>
              {venue.name}.
              <br />
              {` It's a real piece of art.`}
            </p>
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
    </WithNavigationBar>
  );
};

export default ArtPiece;
