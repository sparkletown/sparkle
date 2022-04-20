import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { Button } from "components/attendee/Button";

import { ATTENDEE_INSIDE_URL } from "settings";

import * as api from "api/venue";

import { SpaceWithId } from "types/id";

import { generateUrl } from "utils/url";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import styles from "./Booth.module.scss";

interface BoothProps {
  parentSpace: SpaceWithId;
}
export const BoothCreateCard: React.FC<BoothProps> = ({ parentSpace }) => {
  const { worldSlug } = useWorldParams();
  const history = useHistory();

  const [createBoothState, createBooth] = useAsyncFn(async () => {
    const templateSpaceId = parentSpace.boothTemplateSpaceId;
    if (!templateSpaceId) {
      console.error("Invalid state: no booth template specified.");
      return;
    }
    const { slug: newSpaceSlug } = await api.createBooth({
      parentSpaceId: parentSpace.id,
      templateSpaceId,
    });

    const url = generateUrl({
      route: ATTENDEE_INSIDE_URL,
      required: ["worldSlug", "spaceSlug"],
      params: {
        worldSlug,
        spaceSlug: newSpaceSlug,
      },
    });
    history.push(url);
  });

  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <span className={styles.title}>New Booth</span>
        <div className={styles.presenceContainer}>
          <span className={styles.presenceCount}>
            Description of what a booth is.
          </span>
        </div>
      </div>
      <Button
        variant="panel-primary"
        onClick={createBooth}
        disabled={createBoothState.loading}
      >
        {createBoothState.loading ? "Creating..." : "Create"}
      </Button>
    </div>
  );
};
