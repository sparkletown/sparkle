import React, { useMemo } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { ALWAYS_NOOP_FUNCTION } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { InputField } from "components/atoms/InputField";
import { PosterCategory } from "components/atoms/PosterCategory";
import { ScreeningVideoPreview } from "components/templates/ScreeningRoom/components/ScreeningVideoPreview";
import { useScreeningRoom } from "components/templates/ScreeningRoom/useScreeningRoom";

import "./ScreeningRoomPreview.scss";

export interface ScreeningRoomPreviewProps {
  space: WithId<AnyVenue>;
}

export const ScreeningRoomPreview: React.FC<ScreeningRoomPreviewProps> = ({
  space,
}) => {
  const {
    videos,
    isVideosLoaded,

    categoryList,
    subCategoryList,

    categoryFilter,
    subCategoryFilter,

    setCategoryFilter,
    setSubCategoryFilter,
    unsetCategoryFilter,
  } = useScreeningRoom(space.id);

  const renderedVideoPreviews = useMemo(
    () =>
      videos.map((video) => (
        <ScreeningVideoPreview
          key={video.id}
          video={video}
          selectThisVideo={() => {}}
          selected={false}
        />
      )),
    [videos]
  );

  const renderedCategoryOptions = useMemo(
    () => (
      <div className="ScreeningRoomPreview__categories">
        <PosterCategory
          key="All videos"
          category="All videos"
          onClick={unsetCategoryFilter}
          containerClassName="ScreeningRoomPreview__category"
          active={categoryFilter === undefined}
        />
        {categoryList.map((category) => (
          <PosterCategory
            key={category}
            category={category}
            onClick={() => setCategoryFilter(category)}
            containerClassName="ScreeningRoomPreview__category"
            active={category === categoryFilter}
          />
        ))}
      </div>
    ),
    [categoryList, categoryFilter, setCategoryFilter, unsetCategoryFilter]
  );

  const renderedSubCategoryOptions = useMemo(
    () => (
      <div className="ScreeningRoomPreview__subcategories">
        {subCategoryList.map((subCategory) => (
          <PosterCategory
            key={subCategory}
            category={subCategory}
            onClick={() => setSubCategoryFilter(subCategory)}
            containerClassName="ScreeningRoomPreview__subcategory"
            active={subCategory === subCategoryFilter}
          />
        ))}
      </div>
    ),
    [subCategoryList, subCategoryFilter, setSubCategoryFilter]
  );

  return (
    <div className="ScreeningRoomPreview">
      <div className="ScreeningRoomPreview__container">
        <p className="ScreeningRoomPreview__title">Screening Room</p>
        <InputField
          containerClassName="ScreeningRoomPreview__search-field"
          placeholder="Search for a talk..."
          iconStart={faSearch}
          register={ALWAYS_NOOP_FUNCTION}
        />

        {renderedCategoryOptions}
        {renderedSubCategoryOptions}

        <div className="ScreeningRoomPreview__video-previews">
          {isVideosLoaded ? renderedVideoPreviews : "Loading videos"}
        </div>
      </div>
    </div>
  );
};
