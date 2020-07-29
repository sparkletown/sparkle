import React from "react";
import "firebase/storage";
import "./Account.scss";
import { useUser } from "hooks/useUser";
import AuthenticationModal from "components/organisms/AuthenticationModal";

const Admin: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="page-container">
      Admin
      <AuthenticationModal show={!user} onHide={() => {}} />
    </div>
  );
};

export default Admin;
