import { useSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "react-redux-firebase";
import { currentVenueSelector } from "utils/selectors";

export const useConnectVenueChats = () => {
  const venue = useSelector(currentVenueSelector);

  useFirestoreConnect({
    collection: "venues",
    doc: venue.id,
    subcollections: [{ collection: "chats" }],
    storeAs: "venueChats",
  });
};
