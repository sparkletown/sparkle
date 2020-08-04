import React, { useState } from "react";
import "firebase/storage";
import "./Account.scss";
import { useUser } from "hooks/useUser";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import AdminEvent from "./AdminEvent";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { useHistory, Link } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "hooks/useSelector";

const Admin: React.FC = () => {
  const { user } = useUser();
  const { push } = useHistory();
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const venues = useSelector((state) => state.firestore.ordered.venues);

  useFirestoreConnect([
    {
      collection: "venues",
      where: [["owners", "array-contains", user?.uid]],
    },
  ]);

  return (
    <WithNavigationBar>
      <div className="container admin-container">
        <div className="title">Admin</div>
        <AuthenticationModal show={!user} onHide={() => {}} showAuth="login" />
        My Venues
        {venues?.map((venue) => (
          <div className="information-card-container admin-item" key={venue.id}>
            <h4>{venue.name}</h4>
            <Link to={`/admin/venue/${venue.id}`} className="btn btn-primary">
              Edit
            </Link>
          </div>
        ))}
        <div className="centered-flex">
          <button
            className="btn btn-primary"
            onClick={() => push("/admin/venue/creation")}
          >
            Create a venue
          </button>
        </div>
        <div className="centered-flex">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateEventModal(true)}
          >
            Create an Event
          </button>
        </div>
      </div>
      <AdminEvent
        show={showCreateEventModal}
        onHide={() => {
          setShowCreateEventModal(false);
        }}
        venueId={"demo-event-creation"}
      />
    </WithNavigationBar>
  );
};

export default Admin;
