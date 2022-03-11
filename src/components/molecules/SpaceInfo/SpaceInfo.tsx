import ShowMoreText from "react-show-more-text";

import { AnyVenue } from "types/venues";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import styles from "./SpaceInfo.module.scss";

interface SpaceInfoProps {
  space: AnyVenue;
}

const moreLessSpan = (text: string) => (
  <span className={styles.moreLessSpan}>{text}</span>
);

export const SpaceInfo: React.FC<SpaceInfoProps> = ({ space }) => (
  <div className={styles.spaceInfo}>
    <div className={styles.spaceName}>
      {space.name && <h1>{space.name}</h1>}
    </div>

    {space.description?.text && (
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
              <RenderMarkdown text={space.description?.text} />
            </ShowMoreText>
          </div>
        </div>
      </div>
    )}
  </div>
);
