import { useRoles } from "hooks/useRoles";
import { useUser } from "hooks/useUser";

import { AnyVenue } from "types/venues";

export const useCanDeleteVenueChatMessages = (venue: AnyVenue) => {
  const { userId } = useUser();
  const { userRoles } = useRoles();

  const isAdmin = Boolean(userRoles?.includes("admin"));

  console.log(venue.owners);
  if (!userId) return false;
  const isOwner = venue.owners?.includes(userId);

  return isAdmin && isOwner;
};
