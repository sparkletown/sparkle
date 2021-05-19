import React, { useMemo, useCallback, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { GenericVenue } from "types/venues";
import { ScreeningRoomVideo } from "types/screeningRoom";

import { WithId } from "utils/id";

import { useScreeningRoom } from "./useScreeningRoom";

import { InputField } from "components/atoms/InputField";
import { Button } from "components/atoms/Button";
import { PosterCategory } from "components/atoms/PosterCategory";

import { ScreeningVideoPreview } from "./components/ScreeningVideoPreview";

import "./ScreeningRoom.scss";

export interface ScreeningRoomProps {
  venue: WithId<GenericVenue>;
}

export const ScreeningRoom: React.FC<ScreeningRoomProps> = ({ venue }) => {
  const {
    videos,
    isVideosLoaded,

    increaseDisplayedVideosAmount,

    categoryList,
    subCategoryList,

    searchInputValue,
    categoryFilter,
    subCategoryFilter,

    setSearchInputValue,
    setCategoryFilter,
    setSubCategoryFilter,
  } = useScreeningRoom(venue.id);

  const [selectedVideo, setSelectedVideo] = useState<ScreeningRoomVideo>();

  const onInputFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(e.target.value);
    },
    [setSearchInputValue]
  );

  const renderedVideoPreviews = useMemo(
    () =>
      videos.map((video) => (
        <ScreeningVideoPreview
          key={video.id}
          video={video}
          selectThisVideo={() => setSelectedVideo(video)}
        />
      )),
    [videos]
  );

  const renderedCategoryOptions = useMemo(
    () => (
      <div className="ScreeningRoom__categories">
        {categoryList.map((category) => (
          <PosterCategory
            category={category}
            onClick={() => setCategoryFilter(category)}
          />
        ))}
      </div>
    ),
    []
  );

  const renderedSubCategoryOptions = useMemo(
    () => (
      <div className="ScreeningRoom__subcategories">
        {subCategoryList.map((subCategory) => (
          <div
            className="ScreeningRoom__category-option"
            onClick={() => setSubCategoryFilter(subCategory)}
          >
            {subCategory}
          </div>
        ))}
      </div>
    ),
    []
  );

  return (
    <div className="ScreeningRoom">
      <p className="ScreeningRoom__title">Screening room</p>
      <InputField
        containerClassName="ScreeningRoom__input-container"
        inputClassName="ScreeningRoom__input"
        iconStart={faSearch}
        placeholder="Search for a talk..."
        value={searchInputValue}
        onChange={onInputFieldChange}
      />
      {renderedCategoryOptions}
      {renderedSubCategoryOptions}

      <div className="ScreeningRoom__video-previews">
        {isVideosLoaded ? renderedVideoPreviews : "Loading posters"}
      </div>

      <div className="ScreeningRoom__more-button">
        {isVideosLoaded && (
          <Button onClick={increaseDisplayedVideosAmount}>
            Show more videos
          </Button>
        )}
      </div>
    </div>
  );
};
