import React from "react";
import "firebase/storage";
import "./Account.scss";
import { useUser } from "hooks/useUser";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { useHistory } from "react-router-dom";

const Admin: React.FC = () => {
  const { user } = useUser();
  const { push } = useHistory();

  return (
    <WithNavigationBar>
      <div className="container admin-container">
        <div className="title">Admin</div>
        <AuthenticationModal show={!user} onHide={() => { }} showAuth="login" />
        <div className="centered-flex">
          <button
            className="btn btn-primary"
            onClick={() => push("/admin/venue/creation")}
          >
            Create a venue
          </button>
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default Admin;
