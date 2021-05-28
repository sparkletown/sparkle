import React, {
  MouseEventHandler,
  useCallback,
  // useEffect,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import { VenueEvent, PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { PosterCategory } from "components/atoms/PosterCategory";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

import { updatePersonalizedSchedule, savePosterToProfile } from "api/profile";
import { useUser } from "hooks/useUser";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useVenueEvents } from "hooks/events";

import { WithVenueId } from "utils/id";

import "./PosterPreview.scss";

const emptyRelatedEvents: WithVenueId<VenueEvent>[] = [];
export const emptyPersonalizedSchedule = {};
export const emptyPersonalizedPosters = {};

export interface PosterPreviewProps {
  posterVenue: WithId<PosterPageVenue>;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  posterVenue,
}) => {
  const { title, authorName, categories } = posterVenue.poster ?? {};

  const venueId = posterVenue.id;

  const { userWithId } = useUser();
  const userPosterIds = userWithId?.savedPosters ?? emptyPersonalizedPosters;

  const [isBookmarkedPoster, setBookmarkPoster] = useState(
    //@ts-ignore
    userPosterIds[posterVenue.id]?.[0] === posterVenue.id
  );

  const posterClassnames = classNames("PosterPreview", {
    "PosterPreview--live": posterVenue.isLive,
  });

  const { push: openUrlUsingRouter } = useHistory();
  const handleEnterVenue = useCallback(
    () => enterVenue(venueId, { customOpenRelativeUrl: openUrlUsingRouter }),
    [venueId, openUrlUsingRouter]
  );

  const renderedCategories = useMemo(
    () =>
      Array.from(new Set(categories)).map((category) => (
        <PosterCategory key={category} category={category} active />
      )),
    [categories]
  );

  const { relatedVenueIds } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const { events: relatedVenueEvents = emptyRelatedEvents } = useVenueEvents({
    venueIds: relatedVenueIds,
  });

  const bookmarkPoster = useCallback(() => {
    if (userWithId?.id && posterVenue.id) {
      savePosterToProfile({
        venueId: posterVenue.id,
        userId: userWithId?.id,
        removeMode: isBookmarkedPoster,
      });
    }
    relatedVenueEvents
      .filter((event) => event.venueId === posterVenue.id)
      .map((event) => {
        userWithId?.id &&
          event.id &&
          updatePersonalizedSchedule({
            event: event,
            userId: userWithId?.id,
            removeMode: isBookmarkedPoster,
          });
        return {};
      });
    setBookmarkPoster(!isBookmarkedPoster);
    return relatedVenueEvents;
  }, [userWithId, isBookmarkedPoster, posterVenue, relatedVenueEvents]);

  const onBookmarkPoster: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation();
      bookmarkPoster();
    },
    [bookmarkPoster]
  );

  return (
    <div className={posterClassnames} onClick={handleEnterVenue}>
      <div className="PosterPreview__bookmark" onClick={onBookmarkPoster}>
        <FontAwesomeIcon
          icon={isBookmarkedPoster ? solidBookmark : regularBookmark}
        />
      </div>
      <p className="PosterPreview__title">{title}</p>

      <div className="PosterPreview__categories">{renderedCategories}</div>

      <div className="PosterPreview__author">{authorName}</div>
    </div>
  );
};
