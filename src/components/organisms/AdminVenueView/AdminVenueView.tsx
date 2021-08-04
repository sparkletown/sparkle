import React, { useCallback, useMemo, useState } from "react";
import { Nav } from "react-bootstrap";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faBorderNone } from "@fortawesome/free-solid-svg-icons";

import { Venue_v2 } from "types/venues";

import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useUser } from "hooks/useUser";
import { useIsAdminUser } from "hooks/roles";

import { LoadingPage } from "components/molecules/LoadingPage";
import { Timing } from "./components/Timing";
import { Spaces } from "./components/Spaces";

import "./AdminVenueView.scss";

export enum AdminVenueTab {
  spaces = "spaces",
  timing = "timing",
  run = "run",
}

const adminVenueTabLabelMap: Readonly<Record<AdminVenueTab, String>> = {
  [AdminVenueTab.spaces]: "Spaces",
  [AdminVenueTab.timing]: "Timing",
  [AdminVenueTab.run]: "Run",
};

const tabIcons = {
  [AdminVenueTab.spaces]: faBorderNone,
  [AdminVenueTab.timing]: faClock,
  [AdminVenueTab.run]: faPlayCircle,
};

const DEFAULT_TAB = AdminVenueTab.spaces;

export const AdminVenueView: React.FC = () => {
  const venueId = useVenueId();
  const [selectedTab, setSelectedTab] = useState<AdminVenueTab>(DEFAULT_TAB);

  const { userId } = useUser();
  const { isAdminUser } = useIsAdminUser(userId);

  // Get and pass venue to child components when working on tabs
  const {
    isCurrentVenueLoaded,
    currentVenue: venue,
  } = useConnectCurrentVenueNG(venueId);

  const renderAdminVenueTabs = useMemo(() => {
    return Object.entries(adminVenueTabLabelMap).map(([key, text]) => (
      <Nav.Link
        key={key}
        className={classNames("ViewTab", {
          "ViewTab--selected": selectedTab === key,
        })}
        eventKey={key}
      >
        <FontAwesomeIcon
          className="ViewTab__icon"
          icon={tabIcons[key as AdminVenueTab]}
        />
        {text}
      </Nav.Link>
    ));
  }, [selectedTab]);

  const selectTab = useCallback((tab: string) => {
    setSelectedTab(tab as AdminVenueTab);
  }, []);

  const selectTiming = useCallback(
    () => setSelectedTab(AdminVenueTab.timing),
    []
  );

  if (!isCurrentVenueLoaded) {
    return <LoadingPage />;
  }

  if (!isAdminUser) {
    return <>Forbidden</>;
  }

  return (
    <>
      <div className="AdminVenueView">
        <Nav
          className="AdminVenueView__options"
          activeKey={selectedTab}
          onSelect={selectTab}
        >
          {renderAdminVenueTabs}
        </Nav>
      </div>

      {selectedTab === AdminVenueTab.spaces && (
        <Spaces venue={venue as Venue_v2} onClickNext={selectTiming} />
      )}
      {selectedTab === AdminVenueTab.timing && (
        <Timing
          venue={venue}
          onClickNext={() => setSelectedTab(AdminVenueTab.run)}
          onClickBack={() => setSelectedTab(AdminVenueTab.spaces)}
        />
      )}
      {selectedTab === AdminVenueTab.run && <div>Run</div>}
    </>
  );
};
