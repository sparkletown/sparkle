import React, { useMemo } from "react";
import { faStop, faTv } from "@fortawesome/free-solid-svg-icons";
import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";

import { IFRAME_ALLOW, POSTERPAGE_MAX_VIDEO_PARTICIPANTS } from "settings";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { UserList } from "components/molecules/UserList";

import { PosterCategory } from "components/atoms/PosterCategory";

import { IntroVideoPreviewModal } from "./components/IntroVideoPreviewModal";
import { PosterPageControl } from "./components/PosterPageControl";
import { usePosterVideo } from "./usePosterVideo";

export interface PosterPageProps {
  venue: WithId<PosterPageVenue>;
}

export const PosterPage: React.FC<PosterPageProps> = ({ venue }) => {
  const { id: venueId, poster, iframeUrl } = venue;

  const {
    description,
    descriptionSecondary,
    title,
    introVideoUrl,
    categories,
    presenterName,
    moreInfoUrl,
  } = poster ?? {};

  const {
    isShown: isIntroVideoShown,

    show: showIntroVideoModal,
    hide: hideIntroVideoModal,
  } = useShowHide();

  const {
    activeParticipants,
    passiveListeners,

    isMeActiveParticipant,

    becomePassiveParticipant,
    becomeActiveParticipant,
    localParticipant,
  } = usePosterVideo(venueId);

  const videoParticipants = useMemo(
    () =>
      activeParticipants.map(({ participant, user }, index) => (
        <VideoCommsParticipant
          key={participant.sparkleId ?? `participant-${index}`}
          participant={participant}
          isLocal={participant.twilioId === localParticipant?.twilioId}
        />
      )),
    [activeParticipants, localParticipant?.twilioId]
  );

  const renderedCategories = useMemo(
    () =>
      Array.from(new Set(categories)).map((category) => (
        <PosterCategory key={category} category={category} active />
      )),
    [categories]
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
          <div className="PosterPage__author-box">
            Presented by: {presenterName}
          </div>
          <div className="PosterPage__description">{description}</div>
          <div className="PosterPage__description-secondary">
            {descriptionSecondary}
          </div>

          {moreInfoUrl && (
            <div className="PosterPage__header-info">
              <a
                className="PosterPage__more-info-url"
                href={moreInfoUrl}
                target="_blank"
                rel="noreferrer"
              >
                More info
              </a>
            </div>
          )}

          <div className="PosterPage__categories">{renderedCategories}</div>
        </div>

        <div className="PosterPage__header--right-cell">
          {isMeActiveParticipant && (
            <PosterPageControl
              label="Stop video"
              icon={faStop}
              containerClassNames="PosterPage__control--stop"
              onClick={becomePassiveParticipant}
            />
          )}

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
        {iframeUrl && (
          <iframe
            className="PosterPage__iframe"
            src={iframeUrl}
            title={title}
            allow={IFRAME_ALLOW}
            allowFullScreen
          />
        )}

        {videoParticipants}

        {hasFreeSpace && !isMeActiveParticipant && (
          <div
            className="PosterPage__join-video-participants-btn"
            onClick={becomeActiveParticipant}
          >
            Join with video
          </div>
        )}
      </div>

      <UserList
        usersSample={passiveListeners}
        userCount={passiveListeners.length}
        activity="listening"
      />

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
