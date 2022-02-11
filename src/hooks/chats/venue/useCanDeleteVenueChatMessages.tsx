import { World } from "api/world";

import { SpaceWithId } from "types/id";

import { useUser } from "hooks/useUser";

type UseCanDeleteVenueChatMessagesProps = {
  space: SpaceWithId;
  world?: World;
};

export const useCanDeleteVenueChatMessages = (
  props: UseCanDeleteVenueChatMessagesProps
) => {
  const { world, space } = props;
  const { userId } = useUser();

  if (!userId) return false;

  const isWorldOwner = world?.owners.includes(userId);
  const isOwner = space.owners?.includes(userId);

  return isWorldOwner || isOwner;
};
