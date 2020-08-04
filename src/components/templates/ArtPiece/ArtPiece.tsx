import React from "react";
import "./ArtPiece.scss";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import { useSelector } from "hooks/useSelector";
import InformationCard from "components/molecules/InformationCard";
import ChatDrawer from "components/organisms/ChatDrawer";
import WithNavigationBar from "components/organisms/WithNavigationBar";

const ArtPiece = () => {
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  }));

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
            src={venue.iframeUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <ChatDrawer />
      </div>
    </WithNavigationBar>
  );
};

export default ArtPiece;
