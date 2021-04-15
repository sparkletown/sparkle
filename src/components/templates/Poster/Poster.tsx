import { UserList } from "components/molecules/UserList";
import React from "react";

import { User } from "types/User";

import { PosterVenue } from "types/venues";

import { WithId } from "utils/id";

import "./Poster.scss";

const POSTER_VIDEO_PARTICIPANTS_TRESHOLD = 12;

export interface PosterProps {
  venue: WithId<PosterVenue>;
}

export const Poster: React.FC<PosterProps> = () => {
  const videoParticipants = [<div className="poster__video-participant" />];
  const hasFreeSpace =
    videoParticipants.length <= POSTER_VIDEO_PARTICIPANTS_TRESHOLD;
  const users: readonly WithId<User>[] = [];

  return (
    <div className="poster">
      <div className="poster__iframe">Iframe</div>
      {videoParticipants}
      {hasFreeSpace && (
        <div className="poster__join-video-participants-btn">Join</div>
      )}
      <div className="poster__viewers">
        <UserList users={users} />
      </div>
    </div>
  );
};
