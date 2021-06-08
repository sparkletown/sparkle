import React, { useMemo, useState } from "react";
import { Nav } from "react-bootstrap";
import classNames from "classnames";

import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useUser } from "hooks/useUser";
import { useAdminVenues } from "hooks/useAdminVenues";

import { LoadingPage } from "components/molecules/LoadingPage";
import { AdminTimingView } from "components/organisms/AdminTimingView";

import "./AdminVenueView.scss";

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
  const { user } = useUser();
  useAdminVenues(user?.uid);

  const venueId = useVenueId();
  const [selectedTab, setSelectedTab] = useState<string>(DEFAULT_TAB);

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

  if (venueId && !venue) {
    return <LoadingPage />;
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
      {selectedTab === AdminVenueTab.spaces && <div>Spaces</div>}
      {selectedTab === AdminVenueTab.timing && <AdminTimingView />}
      {selectedTab === AdminVenueTab.run && <div>Run</div>}
    </>
  );
};
