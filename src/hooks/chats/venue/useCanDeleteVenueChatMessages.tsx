import { World } from "api/world";

import { AnyVenue } from "types/venues";

import { useUser } from "hooks/useUser";

export const useCanDeleteVenueChatMessages = (
  venue: AnyVenue,
  world?: World
) => {
  const { userId } = useUser();

  if (!userId) return false;

  const isWorldOwner = world?.owners.includes(userId);
  const isOwner = venue.owners?.includes(userId);

  return isWorldOwner || isOwner;
};
