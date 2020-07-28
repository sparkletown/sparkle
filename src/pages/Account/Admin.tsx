import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import "firebase/storage";
import "./Account.scss";
import { RouterLocation } from "types/RouterLocation";
import { useUser } from "hooks/useUser";

interface PropsType {
  location: RouterLocation;
}

const Admin: React.FunctionComponent<PropsType> = ({ location }) => {
  const history = useHistory();
  const { user } = useUser();
  const redirectToSignUpFlow = useCallback(() => {
    history.push(`/account/register?redirectTo=admin`);
  }, [history]);

  if (!user) redirectToSignUpFlow();

  return <div className="page-container">Admin</div>;
};

export default Admin;
