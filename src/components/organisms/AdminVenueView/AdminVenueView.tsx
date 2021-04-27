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

export interface SidebarOptionType {
  [key: string]: string;
}

export enum SidebarOptions {
  dashboard = "dashboard",
  basicInfo = "basic_info",
  entranceExperience = "entrance_experience",
  advancedMapSettings = "advanced_map_settings",
  ticketingAndAccess = "ticketing_and_access",
}

const sidbarOptions: SidebarOptionType = {
  [SidebarOptions.basicInfo]: "Start",
  [SidebarOptions.entranceExperience]: "Entrance",
  [SidebarOptions.advancedMapSettings]: "Advanced",
  [SidebarOptions.dashboard]: "Dashboard",
};

const DEFAULT_TAB = SidebarOptions.dashboard;

export interface AdminVenueViewProps {
  venue: Venue_v2;
}

export const AdminVenueView: React.FC<AdminVenueViewProps> = ({ venue }) => {
  const [selectedOption, setSelectedOption] = useState<string>(DEFAULT_TAB);

  const selectDefaultTab = useCallback(() => {
    setSelectedOption(DEFAULT_TAB);
  }, []);

  const renderSidebarOptions = useMemo(() => {
    return Object.entries(sidbarOptions).map(([id, text]) => (
      <Nav.Link
        key={id}
        className={classNames("AdminVenueView__tab", {
          "AdminVenueView__tab--selected": selectedOption === id,
        })}
        eventKey={id}
      >
        {text}
      </Nav.Link>
    ));
  }, [selectedOption]);

  return (
    <>
      <div className="AdminVenueView">
        <Button as={Link} to="/admin_v2/venue">
          Back
        </Button>

        <Nav
          className="AdminVenueView__options"
          activeKey={selectedOption}
          onSelect={setSelectedOption}
        >
          {renderSidebarOptions}
        </Nav>
      </div>
      {selectedOption === SidebarOptions.basicInfo && (
        <BasicInfo venue={venue} onSave={selectDefaultTab} />
      )}
      {selectedOption === SidebarOptions.entranceExperience && (
        <EntranceExperience venue={venue} onSave={selectDefaultTab} />
      )}
      {selectedOption === SidebarOptions.advancedMapSettings && (
        <AdvancedSettings venue={venue} onSave={selectDefaultTab} />
      )}
      {selectedOption === SidebarOptions.dashboard && (
        <VenueDetails venue={venue} onSave={selectDefaultTab} />
      )}
    </>
  );
};
