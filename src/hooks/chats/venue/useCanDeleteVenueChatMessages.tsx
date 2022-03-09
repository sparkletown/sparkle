import { SpaceWithId, WorldWithId } from "types/id";

import { useUser } from "hooks/useUser";

type UseCanDeleteVenueChatMessages = (options: {
  space?: SpaceWithId;
  world?: WorldWithId;
}) => boolean;

export const useCanDeleteVenueChatMessages: UseCanDeleteVenueChatMessages = ({
  space,
  world,
}) => {
  const { userId } = useUser();

  if (!userId) return false;

  const isWorldOwner: boolean = !!world?.owners.includes(userId);
  const isOwner: boolean = !!space?.owners?.includes(userId);

  return isWorldOwner || isOwner;
};
