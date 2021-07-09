import React, { Suspense, lazy } from "react";

import { tracePromise } from "utils/performance";

import { Footer } from "components/molecules/Footer";
import { Loading } from "components/molecules/Loading";

import "./WithNavigationBar.scss";

const NavBar = lazy(() =>
  tracePromise("WithNavigationBar::lazy-import::NavBar", () =>
    import("components/molecules/NavBar").then(({ NavBar }) => ({
      default: NavBar,
    }))
  )
);

export interface WithNavigationBarProps {
  hasBackButton?: boolean;
}

export const WithNavigationBar: React.FC<WithNavigationBarProps> = ({
  hasBackButton,
  children,
}) => {
  // @debt remove backButton from Navbar
  return (
    <>
      <Suspense fallback={<Loading />}>
        <NavBar hasBackButton={hasBackButton} />
      </Suspense>

      <div className="navbar-margin">{children}</div>

      <Footer />
    </>
  );
};

/**
 * @deprecated use named export instead
 */
export default WithNavigationBar;
