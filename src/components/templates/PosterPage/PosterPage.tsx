import React, { useMemo } from "react";
import { faTv, faStop } from "@fortawesome/free-solid-svg-icons";

import { POSTERPAGE_MAX_VIDEO_PARTICIPANTS, IFRAME_ALLOW } from "settings";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { VideoParticipant } from "components/organisms/Video";
import { UserList } from "components/molecules/UserList";

import { IntroVideoPreviewModal } from "./components/IntroVideoPreviewModal";
import { PosterPageControl } from "./components/PosterPageControl";
import { PosterPageSettingsControl } from "./components/PosterPageSettingsControl";

import { usePosterVideo } from "./usePosterVideo";

import "./PosterPage.scss";

export interface PosterPageProps {
  venue: WithId<PosterPageVenue>;
}

export const PosterPage: React.FC<PosterPageProps> = ({ venue }) => {
  const {
    id: venueId,
    isLive: isPosterLive = false,
    poster,
    iframeUrl,
  } = venue;

  const { title, introVideoUrl } = poster ?? {};

  const {
    isShown: isIntroVideoShown,

    show: showIntroVideoModal,
    hide: hideIntroVideoModal,
  } = useShowHide();

  const {
    activeParticipants,
    passiveListeners,

    isMeActiveParticipant,

    leaveVideoSeat,
    takeVideoSeat,
  } = usePosterVideo(venueId);

  const videoParticipants = useMemo(
    () =>
      activeParticipants.map((participant, index) => (
        <VideoParticipant
          key={participant.identity ?? `participant-${index}`}
          participant={participant}
          additionalClassNames="PosterPage__video-participant"
        />
      )),
    [activeParticipants]
  );

  const hasFreeSpace =
    videoParticipants.length < POSTERPAGE_MAX_VIDEO_PARTICIPANTS;

  return (
    <div className="PosterPage">
      <div className="PosterPage__header">
        {/* This empty div is needed to properly center the middle cell */}
        <div />

        <div className="PosterPage__header--middle-cell">
          <p className="PosterPage__title">{title}</p>
          <div className="PosterPage__categories" />
        </div>

        <div className="PosterPage__header--right-cell">
          {isMeActiveParticipant && (
            <PosterPageControl
              label="Stop video"
              icon={faStop}
              containerClassNames="PosterPage__control--stop"
              onClick={leaveVideoSeat}
            />
          )}

          <PosterPageSettingsControl
            isPosterLive={isPosterLive}
            venueId={venueId}
          />

          {/* TODO: Implement poster sharing on social media */}
          {/* <PosterPageControl label="Share" icon={faShare} /> */}

          {introVideoUrl && (
            <PosterPageControl
              label="Intro video"
              icon={faTv}
              onClick={showIntroVideoModal}
            />
          )}
        </div>
      </div>

      <div className="PosterPage__content">
        <iframe
          className="PosterPage__iframe"
          src={iframeUrl}
          title={title}
          allow={IFRAME_ALLOW}
          allowFullScreen
        />

        {videoParticipants}

        {hasFreeSpace && !isMeActiveParticipant && (
          <div
            className="PosterPage__join-video-participants-btn"
            onClick={takeVideoSeat}
          >
            Join with video
          </div>
        )}
      </div>

      <div className="PosterPage__listeners">
        <UserList users={passiveListeners} activity="listening" />
      </div>

      {introVideoUrl && (
        <IntroVideoPreviewModal
          isVisible={isIntroVideoShown}
          onHide={hideIntroVideoModal}
          introVideoUrl={introVideoUrl}
        />
      )}
    </div>
  );
};
