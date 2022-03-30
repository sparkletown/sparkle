import React, { useMemo } from "react";

import { IFRAME_ALLOW } from "settings";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { PosterCategory } from "components/atoms/PosterCategory";

import { IntroVideoPreviewModal } from "./components/IntroVideoPreviewModal";

export interface PosterPageProps {
  venue: WithId<PosterPageVenue>;
}

export const PosterPage: React.FC<PosterPageProps> = ({ venue }) => {
  const { poster, iframeUrl } = venue;

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

    hide: hideIntroVideoModal,
  } = useShowHide();

  const renderedCategories = useMemo(
    () =>
      Array.from(new Set(categories)).map((category) => (
        <PosterCategory key={category} category={category} active />
      )),
    [categories]
  );

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
