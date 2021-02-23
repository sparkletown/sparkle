import React, { useCallback, useMemo, useState } from "react";
import { Nav } from "react-bootstrap";
import classNames from "classnames";

import AdvancedSettings from "pages/Admin/AdvancedSettings";
import EntranceExperience from "pages/Admin/EntranceExperience";
import VenueDetails from "pages/Admin/Venue/Details";
import VenueWizard from "pages/Admin/Venue/VenueWizard/VenueWizard";

import { Venue_v2 } from "types/venues";

import "./AdminVenueView.scss";
import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { LoadingPage } from "components/molecules/LoadingPage";

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

const DEFAULT_EDIT_TAB = sidebarOptions.findIndex(
  (option) => option.id === SidebarOptions.dashboard
);

const DEFAULT_CREATE_TAB = sidebarOptions.findIndex(
  (option) => option.id === SidebarOptions.basicInfo
);

export const AdminVenueView: React.FC = () => {
  const venueId = useVenueId();

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const defaultTab = useMemo(() => {
    return venueId ? DEFAULT_EDIT_TAB : DEFAULT_CREATE_TAB;
  }, [venueId]);

  const [selectedOption, setSelectedOption] = useState(
    sidebarOptions[defaultTab].id
  );

  const selectDashboard = useCallback(() => {
    setSelectedOption(sidebarOptions[defaultTab].id);
  }, [defaultTab]);

  if (venueId && !venue) {
    return <LoadingPage />;
  }

  return (
    <>
      <div className="venue-view">
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
              disabled={!venue}
              eventKey={option.id}
            >
              {option.text}
            </Nav.Link>
          ))}
        </Nav>
      </div>
      {selectedOption === SidebarOptions.basicInfo && (
        <VenueWizard onSave={selectDashboard} />
      )}
      {selectedOption === SidebarOptions.entranceExperience && (
        <EntranceExperience
          venue={venue as Venue_v2}
          onSave={selectDashboard}
        />
      )}
      {selectedOption === SidebarOptions.advancedMapSettings && (
        <AdvancedSettings venue={venue as Venue_v2} onSave={selectDashboard} />
      )}
      {selectedOption === SidebarOptions.dashboard && (
        <VenueDetails venue={venue as Venue_v2} />
      )}
    </>
  );
};
