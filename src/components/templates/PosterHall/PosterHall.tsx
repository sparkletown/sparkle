import React, { useMemo } from "react";

import { GenericVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { usePosters } from "hooks/posters";

import { Button } from "components/atoms/Button";

import { PosterPreview } from "./components/PosterPreview";
import { PosterHallSearch } from "./components/PosterHallSearch";

import { useUser } from "hooks/useUser";
import { MyPersonalizedPosters } from "types/User";
import { PosterPageVenue, PersonalizedPoster } from "types/venues";
import { isTruthy } from "utils/types";

import "./PosterHall.scss";

const prepareForMyPosters = (usersPosters: MyPersonalizedPosters) => (
  poster: WithId<PosterPageVenue>
): WithId<PersonalizedPoster> => {
  return {
    ...poster,
    isSaved: isTruthy(
      poster.id && usersPosters[poster.id]?.includes(poster.id)
    ),
  };
};

export interface PosterHallProps {
  venue: WithId<GenericVenue>;
}

export const emptyPersonalizedPosters = {};

export const PosterHall: React.FC<PosterHallProps> = ({ venue }) => {
  const { userWithId } = useUser();
  const userPosterIds =
    userWithId?.myPersonalizedPosters ?? emptyPersonalizedPosters;

  const {
    posterVenues,
    isPostersLoaded,

    increaseDisplayedPosterCount,

    searchInputValue,
    setSearchInputValue,
    liveFilter,
    setLiveFilter,
  } = usePosters(venue.id);

  const posterVenuesPersonalized = posterVenues.map(
    prepareForMyPosters(userPosterIds)
  );

  const renderedPosterPreviews = useMemo(() => {
    return posterVenuesPersonalized.map((posterVenue) => (
      <PosterPreview
        key={posterVenue.id}
        enterVenue={enterVenue}
        personalizedPoster={posterVenue}
      />
    ));
  }, [posterVenuesPersonalized]);

  return (
    <div className="PosterHall">
      <PosterHallSearch
        setSearchInputValue={setSearchInputValue}
        searchInputValue={searchInputValue}
        liveFilterValue={liveFilter}
        setLiveValue={setLiveFilter}
      />

      <div className="PosterHall__posters">
        {isPostersLoaded ? renderedPosterPreviews : "Loading posters"}
      </div>

      <div className="PosterHall__more-button">
        {isPostersLoaded && (
          <Button onClick={increaseDisplayedPosterCount}>
            Show more posters
          </Button>
        )}
      </div>
    </div>
  );
};
