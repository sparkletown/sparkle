import React from "react";
import ShowMoreText from "react-show-more-text";

import { AnyVenue } from "types/venues";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import CN from "./SpaceInfoText.module.scss";

interface SpaceInfoTextProps {
  space: AnyVenue;
}

const moreLessSpan = (text: string) => (
  <span className={CN.moreLessSpan}>{text}</span>
);

export const SpaceInfoText: React.FC<SpaceInfoTextProps> = ({ space }) => (
  <div
    data-bem="SpaceInfoText"
    data-block="SpaceInfoText"
    data-side="att"
    className={CN.spaceInfo}
  >
    <div className={CN.spaceName}>{space.name && <h1>{space.name}</h1>}</div>

    {space?.config?.landingPageConfig?.description && (
      <div className="row">
        <div className="col">
          <div className={CN.description}>
            <ShowMoreText
              lines={1}
              anchorClass={CN.showMoreLessAnchor}
              more={moreLessSpan("More")}
              less={moreLessSpan("Less")}
              expanded={false}
            >
              <RenderMarkdown
                text={space.config.landingPageConfig.description}
              />
            </ShowMoreText>
          </div>
        </div>
      </div>
    )}
  </div>
);
