import {
  FACEBOOK_SHARE_URL,
  FACEBOOK_SPARKLE_APP_ID,
  TWITTER_SHARE_URL,
} from "settings";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";

const getCategoriesFromVenue = (venue: WithId<PosterPageVenue>) =>
  venue?.poster?.categories ?? [];

export interface GetTitleTextForSharingProps {
  venue: WithId<PosterPageVenue>;
  url: string;
}

export const getTitleTextForSharing = ({
  venue,
  url,
}: GetTitleTextForSharingProps) => {
  if (!venue.poster) return "Check out this poster";

  return `Check out this OHBM Poster, ${venue.poster.title} by ${venue.poster.authorName} at ${url}`;
};

export const getFacebookHref = (
  venue: WithId<PosterPageVenue>,
  url: string,
  text: string
) => {
  const categories = getCategoriesFromVenue(venue);
  const hashtagsString = categories.map((category) => `#${category}`).join(",");

  const searchParams = new URLSearchParams({
    app_id: FACEBOOK_SPARKLE_APP_ID,
    u: url,
    quote: text,
    hashtag: hashtagsString,
  }).toString();

  return `${FACEBOOK_SHARE_URL}${searchParams}`;
};

export const getTwitterHref = (
  venue: WithId<PosterPageVenue>,
  text: string
) => {
  const categories = getCategoriesFromVenue(venue);
  const hashtagsString = categories.join(",");

  const searchParams = new URLSearchParams({
    text,
    hashtag: hashtagsString,
  }).toString();

  return `${TWITTER_SHARE_URL}${searchParams}`;
};
