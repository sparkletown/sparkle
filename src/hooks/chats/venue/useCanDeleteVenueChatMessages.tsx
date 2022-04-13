import { World } from "api/world";

import { SpaceWithId } from "types/id";

import { useUserId } from "hooks/user/useUserId";

type UseCanDeleteVenueChatMessagesOptions = {
  space: SpaceWithId;
  world?: World;
};

export const useCanDeleteVenueChatMessages = (
  options: UseCanDeleteVenueChatMessagesOptions
) => {
  const { world, space } = options;
  const { userId } = useUserId();

  if (!userId) return false;

  const isWorldOwner = world?.owners.includes(userId);
  const isOwner = space.owners?.includes(userId);

  return isWorldOwner || isOwner;
};
