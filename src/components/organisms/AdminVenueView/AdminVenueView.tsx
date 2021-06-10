import React, { useMemo, useState } from "react";
import { Nav } from "react-bootstrap";
import classNames from "classnames";

import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useUser } from "hooks/useUser";
import { useRoles } from "hooks/useRoles";
import { useIsAdminUser } from "hooks/roles";

import { LoadingPage } from "components/molecules/LoadingPage";

import "./AdminVenueView.scss";
import { Spaces } from "./components";
import { Venue_v2 } from "types/venues";

export enum AdminVenueTab {
  spaces = "spaces",
  timing = "timing",
  run = "run",
}

const adminVenueTabs: Readonly<Record<AdminVenueTab, String>> = {
  [AdminVenueTab.spaces]: "Spaces",
  [AdminVenueTab.timing]: "Timing",
  [AdminVenueTab.run]: "Run",
};

const DEFAULT_TAB = AdminVenueTab.spaces;

export const AdminVenueView: React.FC = () => {
  const venueId = useVenueId();
  const [selectedTab, setSelectedTab] = useState<string>(DEFAULT_TAB);

  const { user } = useUser();
  const { roles } = useRoles();
  const { isAdminUser } = useIsAdminUser(user?.uid);

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const renderAdminVenueTabs = useMemo(() => {
    return Object.entries(adminVenueTabs).map(([key, text]) => (
      <Nav.Link
        key={key}
        className={classNames("AdminVenueView__tab", {
          "AdminVenueView__tab--selected": selectedTab === key,
        })}
        eventKey={key}
      >
        {text}
      </Nav.Link>
    ));
  }, [selectedTab]);

  if ((venueId && !venue) || !roles) {
    return <LoadingPage />;
  }

  if (!roles.includes("admin") || !isAdminUser) {
    return <>Forbidden</>;
  }

  return (
    <>
      <div className="AdminVenueView">
        <Nav
          className="AdminVenueView__options"
          activeKey={selectedTab}
          onSelect={setSelectedTab}
        >
          {renderAdminVenueTabs}
        </Nav>
      </div>
      {selectedTab === AdminVenueTab.spaces && (
        <Spaces venue={venue as Venue_v2} />
      )}
      {selectedTab === AdminVenueTab.timing && <div>Timing</div>}
      {selectedTab === AdminVenueTab.run && <div>Run</div>}
    </>
  );
};
