import { FACEBOOK_APP_ID } from "secrets";
import { PosterPageVenue } from "types/venues";
import { WithId } from "utils/id";

const getCategoriesFromVeune = (venue: WithId<PosterPageVenue>) => {
  return venue?.poster?.categories || [];
};

export const getTitleTextForSharing = (
  venue: WithId<PosterPageVenue>,
  url: string
) => {
  if (!venue.poster) return "Check out this OHBM Poster";

  return `Check out this OHBM Poster, ${venue.poster.title} by ${venue.poster.authorName} at ${url}`;
};

export const getFacebookHref = (
  venue: WithId<PosterPageVenue>,
  url: string,
  text: string
) => {
  const categories = getCategoriesFromVeune(venue);
  const hashtagsString = categories.reduce((result, hash, index, array) => {
    const isLast = index === array.length - 1;
    const separator = isLast ? "" : ", ";
    return result + `#${hash}${separator}`;
  }, "");

  return `https://www.facebook.com/sharer/sharer.php?app_id=${FACEBOOK_APP_ID}&u=${url}&quote=${text}&hashtag=${hashtagsString}`;
};

export const getTwitterHref = (
  venue: WithId<PosterPageVenue>,
  text: string
) => {
  const categories = getCategoriesFromVeune(venue);
  const hashtagsString = categories.join(",");
  return `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtagsString}`;
};
