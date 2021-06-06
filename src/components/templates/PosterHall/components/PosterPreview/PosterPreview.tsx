import React, {
  MouseEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import { PosterPageVenue } from "types/venues";

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

import "./PosterPreview.scss";

export const emptySavedPosters = {};

export interface PosterPreviewProps {
  posterVenue: WithId<PosterPageVenue>;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  posterVenue,
}) => {
  const { title, authorName, categories } = posterVenue.poster ?? {};

  const venueId = posterVenue.id;

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

  const { events: relatedVenueEvents } = useVenueEvents({
    venueIds: relatedVenueIds,
  });

  const { userWithId } = useUser();
  const userPosterIds = userWithId?.savedPosters ?? emptySavedPosters;

  const [isBookmarkedPoster, setBookmarkPoster] = useState(
    //@ts-ignore
    userPosterIds[venueId]?.[0] === venueId
  );

  const bookmarkPoster = useCallback(() => {
    if (userWithId?.id && venueId) {
      savePosterToProfile({
        venueId: venueId,
        userId: userWithId?.id,
        removeMode: isBookmarkedPoster,
      });
    }
    relatedVenueEvents
      .filter((event) => event.venueId === venueId)
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
  }, [userWithId, isBookmarkedPoster, venueId, relatedVenueEvents]);

  const onBookmarkPoster: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    bookmarkPoster();
  }, [bookmarkPoster]);

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
