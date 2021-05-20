import { FACEBOOK_APP_ID } from "secrets";
import { PosterPageVenue } from "types/venues";
import { WithId } from "utils/id";

export const getTitleTextForSharing = (
  venue: WithId<PosterPageVenue>,
  url: string
) => {
  if (!venue.poster) return "Check out this OHBM Poster";

  return `Check out this OHBM Poster, ${venue.poster.title} by ${venue.poster.authorName} at ${url}`;
};

export const getFacebookHref = (url: string, text: string) =>
  `https://www.facebook.com/sharer/sharer.php?app_id=${FACEBOOK_APP_ID}&u=${url}&quote=${text}&hashtag=#OHBM2021`;

export const getTwitterHref = (text: string) =>
  `https://twitter.com/intent/tweet?text=${text}&hashtags=OHBM2021`;
