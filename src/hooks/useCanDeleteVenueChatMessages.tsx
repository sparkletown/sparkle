import { AnyVenue } from "types/venues";

import { useRoles } from "hooks/useRoles";
import { useUser } from "hooks/useUser";

export const useCanDeleteVenueChatMessages = (venue: AnyVenue) => {
  const { userId } = useUser();
  const { userRoles } = useRoles();

  const isAdmin = Boolean(userRoles?.includes("admin"));

  if (!userId) return false;
  const isOwner = venue.owners?.includes(userId);

  return isAdmin && isOwner;
};
