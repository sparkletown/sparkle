import { FACEBOOK_APP_ID } from "secrets";
import { PosterPageVenue } from "types/venues";
import { WithId } from "utils/id";

const getCategoriesFromVenue = (venue: WithId<PosterPageVenue>) => {
  return venue?.poster?.categories || [];
};

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

  return `https://www.facebook.com/sharer/sharer.php?app_id=${FACEBOOK_APP_ID}&u=${url}&quote=${text}&hashtag=${hashtagsString}`;
};

export const getTwitterHref = (
  venue: WithId<PosterPageVenue>,
  text: string
) => {
  const categories = getCategoriesFromVenue(venue);
  const hashtagsString = categories.join(",");
  return `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtagsString}`;
};
