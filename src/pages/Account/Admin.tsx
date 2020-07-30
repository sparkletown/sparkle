import React from "react";
import "firebase/storage";
import "./Account.scss";
import { useUser } from "hooks/useUser";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";

const Admin: React.FC = () => {
  const { user } = useUser();

  return (
    <WithNavigationBar>
      <div className="container admin-container">
        <div className="title">Admin</div>
        <AuthenticationModal show={!user} onHide={() => {}} />
        <div className="centered-flex">
          <button className="btn btn-primary">Create a venue</button>
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default Admin;
