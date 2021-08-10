import { AnyVenue } from "types/venues";

import { useRoles } from "hooks/useRoles";
import { useUser } from "hooks/useUser";

export const useCanDeleteVenueChatMessages = (venue: AnyVenue) => {
  const { userId } = useUser();
  const { userRoles } = useRoles();

  if (!userId) return false;
  
  const isAdmin = Boolean(userRoles?.includes("admin"));
  const isOwner = venue.owners?.includes(userId);

  return isAdmin && isOwner;
};
