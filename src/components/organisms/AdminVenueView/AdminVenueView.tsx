import React, { useCallback, useState } from "react";
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

enum SidebarOptions {
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

interface AdminVenueViewProps {
  venue: Venue_v2;
}

export const AdminVenueView: React.FC<AdminVenueViewProps> = ({ venue }) => {
  const [selectedOption, setSelectedOption] = useState(
    sidebarOptions[DEFAULT_TAB].id
  );

  const selectDashboard = useCallback(() => {
    setSelectedOption(sidebarOptions[DEFAULT_TAB].id);
  }, []);

  return (
    <>
      <div className="venue-view">
        <Button as={Link} to="/admin_v2/venue">
          Back
        </Button>

        <Nav
          className="venue-view__options"
          activeKey={selectedOption}
          onSelect={setSelectedOption}
        >
          {sidebarOptions.map((option: SidebarOption) => (
            <Nav.Link
              key={option.id}
              className={classNames("venue-view__options--tab", {
                selected: selectedOption === option.id,
              })}
              eventKey={option.id}
            >
              {option.text}
            </Nav.Link>
          ))}
        </Nav>
      </div>
      {selectedOption === SidebarOptions.basicInfo && (
        <BasicInfo venue={venue} onSave={selectDashboard} />
      )}
      {selectedOption === SidebarOptions.entranceExperience && (
        <EntranceExperience venue={venue} onSave={selectDashboard} />
      )}
      {selectedOption === SidebarOptions.advancedMapSettings && (
        <AdvancedSettings venue={venue} onSave={selectDashboard} />
      )}
      {selectedOption === SidebarOptions.dashboard && (
        <VenueDetails venue={venue} onSave={selectDashboard} />
      )}
    </>
  );
};
