import React, { useMemo, useCallback, useState } from "react";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IFRAME_ALLOW } from "settings";

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

    hasHiddenVideos,

    increaseDisplayedVideosAmount,

    categoryList,
    subCategoryList,

    searchInputValue,
    categoryFilter,
    subCategoryFilter,

    setSearchInputValue,
    setCategoryFilter,
    setSubCategoryFilter,
    unsetCategoryFilter,
  } = useScreeningRoom(venue.id);

  const [selectedVideo, setSelectedVideo] = useState<
    WithId<ScreeningRoomVideo>
  >();

  const selectedVideoId = selectedVideo?.id;

  const unSelectVideo = useCallback(() => setSelectedVideo(undefined), []);

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
          selected={video.id === selectedVideoId}
        />
      )),
    [videos, selectedVideoId]
  );

  const renderedCategoryOptions = useMemo(() => {
    return (
      <div className="ScreeningRoom__categories">
        <PosterCategory
          key="All videos"
          category="All videos"
          onClick={unsetCategoryFilter}
          containerClassname="ScreeningRoom__category"
          active={categoryFilter === undefined}
        />
        {categoryList.map((category) => (
          <PosterCategory
            key={category}
            category={category}
            onClick={() => setCategoryFilter(category)}
            containerClassname="ScreeningRoom__category"
            active={category === categoryFilter}
          />
        ))}
      </div>
    );
  }, [categoryList, categoryFilter, setCategoryFilter, unsetCategoryFilter]);

  const renderedSubCategoryOptions = useMemo(
    () => (
      <div className="ScreeningRoom__subcategories">
        {subCategoryList.map((subCategory) => (
          <PosterCategory
            key={subCategory}
            category={subCategory}
            onClick={() => setSubCategoryFilter(subCategory)}
            containerClassname="ScreeningRoom__subcategory"
            active={subCategory === subCategoryFilter}
          />
        ))}
      </div>
    ),
    [subCategoryList, subCategoryFilter, setSubCategoryFilter]
  );

  return (
    <div className="ScreeningRoom">
      <p className="ScreeningRoom__title">Screening room</p>
      {selectedVideo && (
        <div className="ScreeningRoom__video-container">
          {/* We need this additional wrapper to position the close button over the iframe */}
          <div className="ScreeningRoom__video-cover">
            <iframe
              className="ScreeningRoom__video"
              title="selected-video"
              src={selectedVideo.videoSrc}
              frameBorder="0"
              allow={IFRAME_ALLOW}
              allowFullScreen
            />
            <FontAwesomeIcon
              className="ScreeningRoom__close-video-icon"
              icon={faTimesCircle}
              size="lg"
              onClick={unSelectVideo}
            />
          </div>
        </div>
      )}
      <InputField
        containerClassName="ScreeningRoom__input-container"
        iconStart={faSearch}
        placeholder="Search for a talk..."
        value={searchInputValue}
        onChange={onInputFieldChange}
      />
      {renderedCategoryOptions}
      {renderedSubCategoryOptions}

      <div className="ScreeningRoom__video-previews">
        {isVideosLoaded ? renderedVideoPreviews : "Loading videos"}
      </div>

      <div className="ScreeningRoom__more-button">
        {isVideosLoaded && hasHiddenVideos && (
          <Button onClick={increaseDisplayedVideosAmount}>
            Show more videos
          </Button>
        )}
      </div>
    </div>
  );
};
