import { useFirestoreConnect } from "react-redux-firebase";

import { venueChatsSelector } from "utils/selectors";

import { useVenueId } from "hooks/useVenueId";
import { useSelector } from "hooks/useSelector";

export const useVenueChatConnect = () => {
  const venueId = useVenueId();

  useFirestoreConnect({
    collection: "venues",
    doc: venueId,
    subcollections: [{ collection: "chats" }],
    storeAs: "venueChats",
  });
};

export const useVenueChats = () => {
  useVenueChatConnect();

  return useSelector(venueChatsSelector);
};
