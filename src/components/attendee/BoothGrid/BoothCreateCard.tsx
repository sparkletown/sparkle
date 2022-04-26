import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { ATTENDEE_INSIDE_URL } from "settings";

import * as api from "api/venue";

import { SpaceWithId } from "types/id";

import { generateUrl } from "utils/url";

import { useWorldParams } from "hooks/worlds/useWorldParams";

import { BoothCard } from "./BoothCard";

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
    <BoothCard
      title="New Meeting Room"
      buttonText={createBoothState.loading ? "Creating..." : "Create"}
      onButtonClick={createBooth}
      buttonDisabled={createBoothState.loading}
    >
      Create a new space with video chat and screen sharing, with a portal here.
      The space is removed when the last person leaves.
    </BoothCard>
  );
};
