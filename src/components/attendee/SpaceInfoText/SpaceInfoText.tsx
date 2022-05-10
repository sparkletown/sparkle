import React from "react";
import ShowMoreText from "react-show-more-text";
import cn from "classnames";

import { DEFAULT_NUMBER_OF_LINES_OF_TEXT } from "settings";

import { AnyVenue } from "types/venues";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import CN from "./SpaceInfoText.module.scss";

const descriptionLines: Record<SpaceInfoTextVariant, number> = {
  space: 1,
  mobilePortal: DEFAULT_NUMBER_OF_LINES_OF_TEXT,
  desktopPortal: DEFAULT_NUMBER_OF_LINES_OF_TEXT,
};

const moreLessSpan = (text: string) => (
  <span className={CN.moreLessSpan}>{text}</span>
);

type SpaceInfoTextVariant = "space" | "mobilePortal" | "desktopPortal";

interface SpaceInfoTextProps {
  space: AnyVenue;
  variant?: SpaceInfoTextVariant;
}

export const SpaceInfoText: React.FC<SpaceInfoTextProps> = ({
  space,
  variant = "space",
}) => (
  <div
    data-bem="SpaceInfoText"
    data-block="SpaceInfoText"
    data-side="att"
    className={cn(CN.spaceInfo, CN[variant])}
  >
    <div className={CN.spaceName}>{space.name && <h1>{space.name}</h1>}</div>

    {space?.config?.landingPageConfig?.description && (
      <div className={CN.description}>
        <ShowMoreText
          lines={descriptionLines[variant]}
          anchorClass={CN.showMoreLessAnchor}
          more={moreLessSpan("More")}
          less={moreLessSpan("Less")}
        >
          <RenderMarkdown text={space.config.landingPageConfig.description} />
        </ShowMoreText>
      </div>
    )}
  </div>
);
