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

export interface SidebarOption {
  id: string;
  text: string;
}

export enum SidebarOptions {
  dashboard = "dashboard",
  basicInfo = "basic_info",
  entranceExperience = "entrance_experience",
  advancedMapSettings = "advanced_map_settings",
  ticketingAndAccess = "ticketing_and_access",
}

const sidebarOptions: SidebarOption[] = [
  {
    id: SidebarOptions.basicInfo,
    text: "Start",
  },
  {
    id: SidebarOptions.entranceExperience,
    text: "Entrance",
  },
  {
    id: SidebarOptions.advancedMapSettings,
    text: "Advanced",
  },
  {
    id: SidebarOptions.dashboard,
    text: "Dashboard",
  },
  // TODO: Reintroduce when field is decided what to include
  // {
  //   id: SidebarOptions.ticketingAndAccess,
  //   text: "Ticketing and access",
  // },
];

const DEFAULT_TAB = sidebarOptions.findIndex(
  (option) => option.id === SidebarOptions.dashboard
);

export interface AdminVenueViewProps {
  venue: Venue_v2;
}

export const AdminVenueView: React.FC<AdminVenueViewProps> = ({ venue }) => {
  const [selectedOption, setSelectedOption] = useState(
    sidebarOptions[DEFAULT_TAB].id
  );

  const selectDefaultTab = useCallback(() => {
    setSelectedOption(sidebarOptions[DEFAULT_TAB].id);
  }, []);

  const renderSidebarOptions = useMemo(() => {
    return sidebarOptions.map((option: SidebarOption) => (
      <Nav.Link
        key={option.id}
        className={classNames("AdminVenueView__tab", {
          selected: selectedOption === option.id,
        })}
        eventKey={option.id}
      >
        {option.text}
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
