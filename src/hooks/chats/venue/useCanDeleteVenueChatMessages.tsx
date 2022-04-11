import { World } from "api/world";

import { SpaceWithId } from "types/id";

import { useLiveUser } from "hooks/user/useLiveUser";

type UseCanDeleteVenueChatMessagesOptions = {
  space: SpaceWithId;
  world?: World;
};

export const useCanDeleteVenueChatMessages = (
  options: UseCanDeleteVenueChatMessagesOptions
) => {
  const { world, space } = options;
  const { userId } = useLiveUser();

  if (!userId) return false;

  const isWorldOwner = world?.owners.includes(userId);
  const isOwner = space.owners?.includes(userId);

  return isWorldOwner || isOwner;
};
