import React from "react";
import "firebase/storage";
import "./Account.scss";
import { RouterLocation } from "types/RouterLocation";
import { useUser } from "hooks/useUser";
import AuthenticationModal from "components/organisms/AuthenticationModal";

interface PropsType {
  location: RouterLocation;
}

const Admin: React.FunctionComponent<PropsType> = ({ location }) => {
  const { user } = useUser();

  return (
    <div className="page-container">
      Admin
      <AuthenticationModal show={!user} onHide={() => {}} />
    </div>
  );
};

export default Admin;
