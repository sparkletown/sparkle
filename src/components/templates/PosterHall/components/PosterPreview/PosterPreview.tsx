import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { useWorldUsers, useRecentLocationUsers } from "hooks/users";

import { PosterCategory } from "components/atoms/PosterCategory";
import { UserAvatar } from "components/atoms/UserAvatar";

import "./PosterPreview.scss";

export interface PosterPreviewProps {
  posterVenue: WithId<PosterPageVenue>;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  posterVenue,
}) => {
  const {
    title,
    authorName,
    categories,
    authors,
    posterId,
    moreInfoUrl,
    contactEmail,
  } = posterVenue.poster ?? {};

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

  const { worldUsers } = useWorldUsers();

  const userPresenter = useMemo<JSX.Element[]>(() => {
    return worldUsers
      .filter((user) => user.partyName === authorName)
      .map((user) => (
        <UserAvatar key={`user-${user.id}`} user={user} showStatus />
      ));
  }, [worldUsers, authorName]);

  const recentPosterUsers = useRecentLocationUsers(posterVenue.name);
  const numUsers = recentPosterUsers.recentLocationUsers.length;

  return (
    <div className={posterClassnames} onClick={handleEnterVenue}>
      <div className="PosterPreview__header">
        {posterId && (
          <div className="PosterPreview__posterId">
            {moreInfoUrl ? (
              <a href={moreInfoUrl} target="_blank" rel="noreferrer">
                {posterId}
              </a>
            ) : (
              { posterId }
            )}
          </div>
        )}
        {numUsers > 0 && (
          <div className="PosterPreview__visiting">
            {numUsers} {numUsers === 1 ? "current visitor" : "current visitors"}
          </div>
        )}
      </div>

      <p className="PosterPreview__title">{title}</p>

      {!posterId && moreInfoUrl && (
        <p className="PosterPreview__moreInfoUrl">
          <a href={moreInfoUrl} target="_blank" rel="noreferrer">
            {moreInfoUrl.replace(/(^\w+:|^)\/\//, "")}
          </a>
        </p>
      )}

      {contactEmail && (
        <p className="PosterPreview__contactEmail">{contactEmail}</p>
      )}

      <div className="PosterPreview__categories">{renderedCategories}</div>

      <div className="PosterPreview__authorBox">
        <div className="PosterPreview__avatar">{userPresenter}</div>

        <p className="PosterPreview__author">
          {authors?.join(", ") ?? authorName}
        </p>
      </div>
    </div>
  );
};
