import React, { useCallback } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

import { currentVenueSelectorData } from "utils/selectors";
import { venueInsideUrl } from "utils/url";

import { useVenueId } from "hooks/useVenueId";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import NavBar from "components/molecules/NavBar";
import NavSearchBar from "components/molecules/NavSearchBar";
import { Footer } from "components/molecules/Footer";
import { NavbarSchedule } from "components/molecules/NavbarSchedule";
import { VenuePartygoers } from "components/molecules/VenuePartygoers";
import { NavbarRadio } from "components/molecules/NavbarRadio";
import { NavbarProfile } from "components/molecules/NavbarProfile";
import { NavBarLogin } from "components/molecules/NavBar/NavBarLogin";
import { GiftTicketModal } from "../GiftTicketModal/GiftTicketModal";

import "./WithNavigationBar.scss";

interface PropsType {
  children: React.ReactNode;
  redirectionUrl?: string;
  fullscreen?: boolean;
  hasBackButton?: boolean;
}

export const WithNavigationBar: React.FunctionComponent<PropsType> = ({
  redirectionUrl,
  fullscreen,
  children,
}) => {
  const { user } = useUser();
  const venueId = useVenueId();
  const venue = useSelector(currentVenueSelectorData);
  const navigateToHomepage = useCallback(() => {
    const venueLink =
      redirectionUrl ?? venueId ? venueInsideUrl(venueId ?? "") : "/";

    window.location.href = venueLink;
  }, [redirectionUrl, venueId]);

  const leftComponent = (
    <div className="nav-logos">
      <div className="nav-sparkle-logo">
        <div className="nav-sparkle-logo_small" onClick={navigateToHomepage} />
      </div>
      {venue && (
        <>
          <NavbarSchedule />
          <VenuePartygoers />
        </>
      )}
    </div>
  );

  const rightComponent = user ? (
    <div className="navbar-links">
      {venue && <NavSearchBar />}

      {venue?.showGiftATicket && (
        <OverlayTrigger
          trigger="click"
          placement="bottom-end"
          rootClose={true}
          overlay={
            <Popover id="gift-popover">
              <Popover.Content>
                <GiftTicketModal />
              </Popover.Content>
            </Popover>
          }
        >
          <span className="private-chat-icon">
            <div className="navbar-link-gift" />
          </span>
        </OverlayTrigger>
      )}

      <NavbarRadio />
      <NavbarProfile />
    </div>
  ) : (
    <NavBarLogin />
  );

  return (
    <>
      <NavBar leftComponent={leftComponent} rightComponent={rightComponent} />
      <div className={`navbar-margin ${fullscreen ? "fullscreen" : ""}`}>
        {children}
      </div>
      <Footer />
    </>
  );
};

/**
 * @deprecated use named export instead
 */
export default WithNavigationBar;
