import ShowMoreText from "react-show-more-text";

import { AnyVenue } from "types/venues";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import styles from "./SpaceInfoText.module.scss";

interface SpaceInfoTextProps {
  space: AnyVenue;
}

const moreLessSpan = (text: string) => (
  <span className={styles.moreLessSpan}>{text}</span>
);

export const SpaceInfoText: React.FC<SpaceInfoTextProps> = ({ space }) => (
  <div className={styles.spaceInfo}>
    <div className={styles.spaceName}>
      {space.name && <h1>{space.name}</h1>}
    </div>

    {space?.config?.landingPageConfig?.description && (
      <div className="row">
        <div className="col">
          <div className="description">
            <ShowMoreText
              lines={1}
              anchorClass={styles.showMoreLessAnchor}
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
