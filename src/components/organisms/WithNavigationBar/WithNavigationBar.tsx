import React from "react";
import NavBar from "components/molecules/NavBar";
import "./WithNavigationBar.scss";

interface PropsType {
  children: React.ReactNode;
  redirectionUrl?: string;
}

const WithNavigationBar: React.FunctionComponent<PropsType> = ({
  redirectionUrl,
  children,
}) => (
  <>
    <NavBar redirectionUrl={redirectionUrl} />
    <div className="navbar-margin">{children}</div>
  </>
);

export default WithNavigationBar;
