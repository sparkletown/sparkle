import React from "react";

import NavBar from "components/molecules/NavBar";
import { Footer } from "components/molecules/Footer";

import "./WithNavigationBar.scss";

interface PropsType {
  children: React.ReactNode;
  redirectionUrl?: string;
  hasBackButton?: boolean;
}

export const WithNavigationBar: React.FunctionComponent<PropsType> = ({
  redirectionUrl,
  children,
  hasBackButton,
}) => (
  <>
    {/* @debt remove backButton from Navbar */}
    <NavBar redirectionUrl={redirectionUrl} hasBackButton={hasBackButton} />
    <div className="navbar-margin">{children}</div>
    <Footer />
  </>
);

/**
 * @deprecated use named export instead
 */
export default WithNavigationBar;
