import React, { lazy } from "react";

import { tracePromise } from "utils/performance";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

import { NewProfileModal } from "components/organisms/NewProfileModal";

import { Footer } from "components/molecules/Footer";

import { MobileWarning } from "components/atoms/MobileWarning";

import "./WithNavigationBar.scss";

const NavBar = lazy(() =>
  tracePromise("WithNavigationBar::lazy-import::NavBar", () =>
    import("components/attendee/NavBar").then(({ NavBar }) => ({
      default: NavBar,
    }))
  )
);

interface WithNavigationBarProps {
  hasBackButton?: boolean;
  withSchedule?: boolean;
  withRadio?: boolean;
  withPhotobooth?: boolean;
  withHiddenLoginButton?: boolean;
  title?: string;
  variant?: "internal-scroll";
}

export const WithNavigationBar: React.FC<WithNavigationBarProps> = ({
  hasBackButton,
  withSchedule,
  withPhotobooth,
  withHiddenLoginButton,
  withRadio,
  title,
  variant,
  children,
}) => {
  const { space } = useWorldAndSpaceByParams();
  return (
    <>
      <RelatedVenuesProvider>
        {/* @debt remove backButton from Navbar */}
        <NavBar
          hasBackButton={hasBackButton}
          withSchedule={withSchedule}
          withPhotobooth={withPhotobooth}
          withHiddenLoginButton={withHiddenLoginButton}
          withRadio={withRadio}
          title={title}
        />
      </RelatedVenuesProvider>

      <MobileWarning />

      {variant === "internal-scroll" ? (
        <div className="WithNavigationBar__wrapper WithNavigationBar__wrapper--internal-scroll">
          <div className="WithNavigationBar__slider WithNavigationBar__slider--internal-scroll">
            {children}
          </div>
        </div>
      ) : (
        <div className="WithNavigationBar__wrapper">{children}</div>
      )}

      <Footer />
      <NewProfileModal space={space} />
    </>
  );
};
