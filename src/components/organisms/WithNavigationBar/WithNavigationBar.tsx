import React from "react";
import NavBar from "components/molecules/NavBar";
import "./WithNavigationBar.scss";

interface PropsType {
  children: React.ReactNode;
}

const WithNavigationBar: React.FunctionComponent<PropsType> = ({
  children,
}) => (
  <>
    <NavBar />
    <div className="navbar-margin">{children}</div>
  </>
);

export default WithNavigationBar;
