import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";

import { PersonalizedPoster } from "types/venues";

import { WithId } from "utils/id";

import { PosterCategory } from "components/atoms/PosterCategory";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

import { saveEventToProfile, savePosterToProfile } from "api/profile";
import { useUser } from "hooks/useUser";

import { UserAvatar } from "components/atoms/UserAvatar";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useWorldUsersById } from "hooks/users";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";

import "./PosterPreview.scss";

export interface PosterPreviewProps {
  enterVenue: (venueId: string) => void;
  personalizedPoster: WithId<PersonalizedPoster>;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  enterVenue,
  personalizedPoster,
}) => {
  const [isBookmarkedPoster, setBookmarkPoster] = useState(
    personalizedPoster.isSaved
  );

  useEffect(() => {
    setBookmarkPoster(personalizedPoster.isSaved);
  }, [personalizedPoster.isSaved]);

  const { userId } = useUser();

  const posterClassnames = classNames("PosterPreview", {
    "PosterPreview--live": personalizedPoster.isLive,
  });

  const { title, authorName, categories } = personalizedPoster.poster ?? {};

  const venueId = personalizedPoster.id;

  const handleEnterVenue = useCallback(() => enterVenue(venueId), [
    enterVenue,
    venueId,
  ]);

  const renderedCategories = useMemo(
    () =>
      Array.from(new Set(categories)).map((category) => (
        <PosterCategory key={category} category={category} />
      )),
    [categories]
  );

  const { subvenueEvents } = useConnectRelatedVenues({
    venueId,
    withEvents: true,
  });

  const bookmarkPoster = useCallback(() => {
    setBookmarkPoster(!isBookmarkedPoster);
    personalizedPoster.isSaved = !personalizedPoster.isSaved;
    if (userId && personalizedPoster.id) {
      savePosterToProfile({
        venueId: personalizedPoster.id,
        userId: userId,
        removeMode: !personalizedPoster.isSaved,
      });
    }
    subvenueEvents
      .filter((event) => event.venueId === personalizedPoster.id)
      .map((event) => {
        userId &&
          event.id &&
          saveEventToProfile({
            venueId: personalizedPoster.id,
            userId: userId,
            removeMode: !personalizedPoster.isSaved,
            eventId: event.id,
          });
      });
    return subvenueEvents;
  }, [userId, isBookmarkedPoster, personalizedPoster, subvenueEvents]);

  const onBookmarkPoster: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation();
      bookmarkPoster();
    },
    [bookmarkPoster]
  );

  // wrap author in memo:
  const { worldUsersById } = useWorldUsersById();
  const authors = personalizedPoster.owners;
  const author = { ...worldUsersById[authors[0]], id: authors[0] };
  const { openUserProfileModal } = useProfileModalControls();
  const openAuthorProfile = useCallback(() => {
    openUserProfileModal(author);
  }, [openUserProfileModal, author]);

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
      {/* don't show author profile if not available... */}
      {author && (
        <UserAvatar
          user={author}
          // isOnline={}
          onClick={openAuthorProfile}
        />
      )}
    </div>
  );
};
