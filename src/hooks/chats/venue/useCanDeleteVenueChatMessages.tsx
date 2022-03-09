import { World } from "api/world";

import { SpaceWithId } from "types/id";

import { useUser } from "hooks/useUser";

type UseCanDeleteVenueChatMessagesOptions = {
  space: SpaceWithId;
  world?: World;
};

export const useCanDeleteVenueChatMessages = (
  options: UseCanDeleteVenueChatMessagesOptions
) => {
  const { world, space } = options;
  const { userId } = useUser();

  if (!userId) return false;

  const isWorldOwner = world?.owners.includes(userId);
  const isOwner = space.owners?.includes(userId);

  return isWorldOwner || isOwner;
};
