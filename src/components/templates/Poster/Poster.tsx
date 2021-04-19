import { UserList } from "components/molecules/UserList";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faShare, faTv } from "@fortawesome/free-solid-svg-icons";

import { PosterVenue } from "types/venues";

import { useRecentVenueUsers } from "hooks/users";

import { WithId } from "utils/id";

import "./Poster.scss";

const POSTER_CELL_COUNT_MAX = 10;

export interface PosterProps {
  venue: WithId<PosterVenue>;
}

export const Poster: React.FC<PosterProps> = ({ venue }) => {
  const { recentVenueUsers } = useRecentVenueUsers();

  const videoParticipants = Array(0).fill(
    <div className="poster__video-participant" />
  );
  const hasFreeSpace = videoParticipants.length < POSTER_CELL_COUNT_MAX;

  return (
    <div className="poster">
      <div className="poster__header">
        <div />
        <div className="poster__header--middle-cell">
          <p className="poster__title">Very serious topic</p>
          <div className="poster__categories" />
        </div>
        <div className="poster__header--right-cell">
          <div className="poster__control">
            <FontAwesomeIcon icon={faCog} size="lg" />
            <span className="poster__control-text">Settings</span>
          </div>
          <div className="poster__control">
            <FontAwesomeIcon icon={faShare} size="lg" />
            <span className="poster__control-text">Share</span>
          </div>
          <div className="poster__control">
            <FontAwesomeIcon icon={faTv} size="lg" />
            <span className="poster__control-text">Intro Video</span>
          </div>
        </div>
      </div>
      <div className="poster__content">
        <iframe
          className="poster__iframe"
          src={venue.iframeUrl}
          title="poster-iframe"
        />
        {videoParticipants}
        {hasFreeSpace && (
          <div className="poster__join-video-participants-btn">
            Join with video
          </div>
        )}
      </div>

      <div className="poster__listeners">
        <UserList users={recentVenueUsers} activity="listening" />
      </div>
    </div>
  );
};
