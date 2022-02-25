import React from "react";

import { DEFAULT_IMAGE_INPUT_BACKGROUND } from "settings";

import { World } from "api/world";

import { WithId } from "utils/id";
import { worldEditStartValuesSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import "./WorldShowcase.scss";

export interface WorldShowcaseProps {
  world?: WithId<World>;
}

export const WorldShowcase: React.FC<WorldShowcaseProps> = ({ world }) => {
  const dirty = useSelector(worldEditStartValuesSelector);
  const banner =
    dirty?.bannerImageUrl ||
    (world?.config?.landingPageConfig?.coverImageUrl ??
      DEFAULT_IMAGE_INPUT_BACKGROUND);

  return (
    <section className="WorldShowcase">
      <div className="border-t border-gray-200 px-12 py-12 sm:px-12">
        <img className="w-full rounded-md" src={banner} alt="world banner" />
      </div>
    </section>
  );
};
