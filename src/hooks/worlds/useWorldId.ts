import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

export const useWorldId = (): string | undefined => {
  const { currentVenue: venue } = useConnectCurrentVenueNG();

  return venue?.worldId;
};
