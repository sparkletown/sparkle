import React, { useState } from "react";
import "./ArtPiece.scss";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import { useSelector } from "hooks/useSelector";
import InformationCard from "components/molecules/InformationCard";
import ChatDrawer from "components/organisms/ChatDrawer";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import Room from "components/organisms/Room";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";
import { Modal } from "react-bootstrap";
import { SchedulePageModal } from "components/organisms/SchedulePageModal/SchedulePageModal";
import { IS_BURN } from "secrets";

export const ConvertToEmbeddableUrl = (string: string | undefined) => {
  if (string?.includes("youtube")) {
    return string?.replace("watch?v=", "embed/");
  } else if (string?.includes("vimeo") && !string?.includes("player")) {
    return string?.replace("vimeo.com/", "player.vimeo.com/video/");
  } else {
    return string?.includes("http") ? string : "//" + string;
  }
};

const ArtPiece = () => {
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  }));

  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);
  const [showEventSchedule, setShowEventSchedule] = useState(false);

  if (!venue) return <>Loading...</>;

  const iFrameUrl = ConvertToEmbeddableUrl(
    venue.iframeUrl ?? venue.embedIframeUrl
  );
  return (
    <WithNavigationBar>
      <div className="full-page-container art-piece-container">
        <InformationLeftColumn
          venueLogoPath={venue?.host.icon ?? ""}
          isLeftColumnExpanded={isLeftColumnExpanded}
          setIsLeftColumnExpanded={setIsLeftColumnExpanded}
        >
          <InformationCard title="About the venue">
            <p className="title-sidebar">{venue.name}.</p>
            <p className="short-description-sidebar" style={{ fontSize: 18 }}>
              {venue.config?.landingPageConfig.subtitle}
            </p>
            <p style={{ fontSize: 13 }}>
              {venue.config?.landingPageConfig.description}
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
              defaultMute={true}
            />
          </div>
        </div>
        <ChatDrawer
          title={"Art Piece Chat"}
          roomName={venue.name}
          chatInputPlaceholder="Chat"
          defaultShow={true}
        />
      </div>
      {IS_BURN && (
        <div className="sparkle-fairies">
          <SparkleFairiesPopUp setShowEventSchedule={setShowEventSchedule} />
        </div>
      )}
      <Modal
        show={showEventSchedule}
        onHide={() => setShowEventSchedule(false)}
        dialogClassName="custom-dialog"
      >
        <Modal.Body>
          <SchedulePageModal />
        </Modal.Body>
      </Modal>
    </WithNavigationBar>
  );
};

export default ArtPiece;
