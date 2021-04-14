import React, { ReactNode } from "react";

import { currentVenueSelectorData, parentVenueSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";

import "./NavBar.scss";
import "./playa.scss";

export interface NavBarPropsType {
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
}

export const NavBar: React.FC<NavBarPropsType> = ({
  leftComponent,
  rightComponent,
}) => {
  const venue = useSelector(currentVenueSelectorData);
  const venueParentId = venue?.parentId;
  const parentVenue = useSelector(parentVenueSelector);

  // @debt Move connect from Navbar to a hook
  useFirestoreConnect(
    venueParentId
      ? {
          collection: "venues",
          doc: venueParentId,
          storeAs: "parentVenue",
        }
      : undefined
  );

  return (
    <>
      <header>
        <div className={`navbar navbar_playa nonplaya`}>
          <div className="navbar-container">
            {leftComponent}
            {rightComponent}
          </div>
        </div>
      </header>

      {/* @debt Remove back button from Navbar */}
      {venue?.parentId && parentVenue?.name && (
        <div className="back-map-btn">
          <div className="back-icon" />
          <span className="back-link">
            Back{parentVenue ? ` to ${parentVenue.name}` : ""}
          </span>
        </div>
      )}
    </>
  );
};

export default NavBar;
