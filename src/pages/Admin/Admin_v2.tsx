import React from "react";
import "firebase/storage";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useParams } from "react-router-dom";

// Components
import AuthenticationModal from "components/organisms/AuthenticationModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import VenueDetails from "./Venue/Details";

// Hooks
import { useKeyedSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useFirestoreConnect } from "react-redux-firebase";
import { useQuery } from "hooks/useQuery";
import useRoles from "hooks/useRoles";

// Styles
import "./Admin.scss";
import { IS_BURN } from "secrets";
import { Venue_v2 } from "types/Venue";
import VenueList from "./VenueList";

dayjs.extend(advancedFormat);

const Admin: React.FC = () => {
  const { user } = useUser();
  const { venueId } = useParams<{ venueId: string }>();
  const queryParams = useQuery();
  const queryRoomIndexString = queryParams.get("roomIndex");
  const queryRoomIndex = queryRoomIndexString
    ? parseInt(queryRoomIndexString)
    : undefined;

  const { venues } = useKeyedSelector(
    (state) => ({
      venues: state.firestore.data.venues ?? {},
    }),
    ["venues"]
  );
  const venue = venues[venueId];

  useFirestoreConnect([
    {
      collection: "venues",
      where: [["owners", "array-contains", user?.uid || ""]],
    },
  ]);
  const { roles } = useRoles();
  if (!roles) {
    return <>Loading...</>;
  }
  if (!IS_BURN && !roles.includes("admin")) {
    return <>Forbidden</>;
  }

  return (
    <WithNavigationBar fullscreen>
      <div className="admin-dashboard">
        <AuthenticationModal show={!user} onHide={() => {}} showAuth="login" />
        <div className="page-container page-container_adminview">
          <div className="page-container-adminsidebar">
            <VenueList selectedVenueId={venueId} roomIndex={queryRoomIndex} />
          </div>
          {venueId ? (
            <VenueDetails venue={venue as Venue_v2} />
          ) : (
            <>Select a venue to see its details</>
          )}
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default Admin;
