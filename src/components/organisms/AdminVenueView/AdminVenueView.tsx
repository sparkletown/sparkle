import React, { useCallback, useMemo, useState } from "react";
import { Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import classNames from "classnames";

import AdvancedSettings from "pages/Admin/AdvancedSettings";
import BasicInfo from "pages/Admin/BasicInfo";
import EntranceExperience from "pages/Admin/EntranceExperience";
import VenueDetails from "pages/Admin/Venue/Details";

import { Venue_v2 } from "types/venues";

import "./AdminVenueView.scss";

export enum AdminVenueTab {
  dashboard = "dashboard",
  basicInfo = "basic_info",
  entranceExperience = "entrance_experience",
  advancedMapSettings = "advanced_map_settings",
}

const adminVenueTabs: Record<AdminVenueTab, String> = {
  [AdminVenueTab.basicInfo]: "Start",
  [AdminVenueTab.entranceExperience]: "Entrance",
  [AdminVenueTab.advancedMapSettings]: "Advanced",
  [AdminVenueTab.dashboard]: "Dashboard",
};

const DEFAULT_TAB = AdminVenueTab.dashboard;

export interface AdminVenueViewProps {
  venue: Venue_v2;
}

export const AdminVenueView: React.FC<AdminVenueViewProps> = ({ venue }) => {
  const [selectedTab, setSelectedTab] = useState<string>(DEFAULT_TAB);

  const selectDefaultTab = useCallback(() => {
    setSelectedTab(DEFAULT_TAB);
  }, []);

  const renderAdminVenueTabs = useMemo(() => {
    return Object.entries(adminVenueTabs).map(([id, text]) => (
      <Nav.Link
        key={id}
        className={classNames("AdminVenueView__tab", {
          "AdminVenueView__tab--selected": selectedTab === id,
        })}
        eventKey={id}
      >
        {text}
      </Nav.Link>
    ));
  }, [selectedTab]);

  return (
    <>
      <div className="AdminVenueView">
        <Button as={Link} to="/admin_v2/venue">
          Back
        </Button>

        <Nav
          className="AdminVenueView__options"
          activeKey={selectedTab}
          onSelect={setSelectedTab}
        >
          {renderAdminVenueTabs}
        </Nav>
      </div>
      {selectedTab === AdminVenueTab.basicInfo && (
        <BasicInfo venue={venue} onSave={selectDefaultTab} />
      )}
      {selectedTab === AdminVenueTab.entranceExperience && (
        <EntranceExperience venue={venue} onSave={selectDefaultTab} />
      )}
      {selectedTab === AdminVenueTab.advancedMapSettings && (
        <AdvancedSettings venue={venue} onSave={selectDefaultTab} />
      )}
      {selectedTab === AdminVenueTab.dashboard && (
        <VenueDetails venue={venue} />
      )}
    </>
  );
};
