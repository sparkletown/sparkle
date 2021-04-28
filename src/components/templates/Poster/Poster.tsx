import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faShare,
  faTv,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Popover } from "react-bootstrap";

import { setVenueLiveStatus } from "api/venue";

import { POSTER_CELL_COUNT_MAX } from "settings";

import { PosterVenue } from "types/venues";

import { WithId } from "utils/id";

import { VideoParticipant } from "components/organisms/Video";
import { UserList } from "components/molecules/UserList";
import { Toggler } from "components/atoms/Toggler";

import { usePosterVideo } from "./usePosterVideo";

import { IntroVideoPreviewModal } from "./components/IntroVideoPreviewModal";

import "./Poster.scss";

export interface PosterProps {
  venue: WithId<PosterVenue>;
}

export const Poster: React.FC<PosterProps> = ({ venue }) => {
  const [isIntroVideoShown, setIntroVideoShown] = useState<boolean>(false);

  const showIntroVideoModal = () => {
    setIntroVideoShown(true);
  };

  const hideIntroVideoModal = () => {
    setIntroVideoShown(false);
  };

  const {
    activeParticipants,
    passiveListerens,

    isMeActiveParticipant,

    turnVideoOff,
    turnVideoOn,
  } = usePosterVideo(venue.id);

  const isPosterLive = venue.isLive;

  const setVenueLiveOn = () => {
    setVenueLiveStatus(venue.id, true);
  };

  const setVenueLiveOff = () => {
    setVenueLiveStatus(venue.id, false);
  };

  const videoParticipants = activeParticipants.map((participant) => (
    <VideoParticipant
      participant={participant}
      key={participant.identity}
      additionalClassNames="poster__video-participant"
    />
  ));

  const hasFreeSpace = videoParticipants.length < POSTER_CELL_COUNT_MAX;

  return (
    <>
      <div className="poster">
        <div className="poster__header">
          <div />

          <div className="poster__header--middle-cell">
            <p className="poster__title">{venue.title}</p>
            <div className="poster__categories" />
          </div>

          <div className="poster__header--right-cell">
            {isMeActiveParticipant && (
              <div
                className="poster__control poster__control--stop"
                onClick={turnVideoOff}
              >
                <FontAwesomeIcon icon={faStop} size="lg" />
                <span className="poster__control-text">Stop video</span>
              </div>
            )}

            <OverlayTrigger
              trigger="click"
              placement="bottom-end"
              overlay={
                <Popover
                  id="popover-basic"
                  className="poster__settings-popover"
                >
                  <Popover.Content className="poster__settings-popover-content">
                    <Toggler
                      type="checkbox"
                      className="switch-hidden-input"
                      checked={!!isPosterLive}
                      onChange={isPosterLive ? setVenueLiveOff : setVenueLiveOn}
                      title={
                        isPosterLive ? "Poster is live" : "Make poster live"
                      }
                    />
                  </Popover.Content>
                </Popover>
              }
              rootClose={true}
            >
              <div className="poster__control">
                <FontAwesomeIcon icon={faCog} size="lg" />
                <span className="poster__control-text">Settings</span>
              </div>
            </OverlayTrigger>

            <div className="poster__control">
              <FontAwesomeIcon icon={faShare} size="lg" />
              <span className="poster__control-text">Share</span>
            </div>

            {venue.introVideoUrl && (
              <div className="poster__control" onClick={showIntroVideoModal}>
                <FontAwesomeIcon icon={faTv} size="lg" />
                <span className="poster__control-text">Intro Video</span>
              </div>
            )}
          </div>
        </div>

        <div className="poster__content">
          <iframe
            className="poster__iframe"
            src={venue.iframeUrl}
            title="poster-iframe"
          />

          {videoParticipants}

          {hasFreeSpace && !isMeActiveParticipant && (
            <div
              className="poster__join-video-participants-btn"
              onClick={turnVideoOn}
            >
              Join with video
            </div>
          )}
        </div>

        <div className="poster__listeners">
          <UserList users={passiveListerens} activity="listening" />
        </div>
      </div>
      <IntroVideoPreviewModal
        isVisible={isIntroVideoShown}
        onHide={hideIntroVideoModal}
        posterVenue={venue}
      />
    </>
  );
};
