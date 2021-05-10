import React, { useCallback, useState } from "react";
import { Nav } from "react-bootstrap";
import classNames from "classnames";

import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import { LoadingPage } from "components/molecules/LoadingPage";
import AdvancedSettings from "pages/Admin/AdvancedSettings";
import EntranceExperience from "pages/Admin/EntranceExperience";
import VenueWizard from "pages/Admin/Venue/VenueWizard/VenueWizard";

import { Venue_v2 } from "types/venues";

// import "./AdminVenueView.scss";

export interface SidebarOption {
  id: string;
  text: string;
}

enum SidebarOptions {
  basicInfo = "basic_info",
  entranceExperience = "entrance_experience",
  advancedMapSettings = "advanced_map_settings",
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
];

const DEFAULT_TAB = sidebarOptions.findIndex(
  (option) => option.id === SidebarOptions.basicInfo
);

export const AdminAdvancedSettings: React.FC = () => {
  const venueId = useVenueId();

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const [selectedOption, setSelectedOption] = useState(
    sidebarOptions[DEFAULT_TAB].id
  );

  const selectDashboard = useCallback(() => {
    setSelectedOption(sidebarOptions[DEFAULT_TAB].id);
  }, []);

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
      {selectedOption === SidebarOptions.basicInfo && <VenueWizard />}
      {selectedOption === SidebarOptions.entranceExperience && (
        <EntranceExperience
          venue={venue as Venue_v2}
          onSave={selectDashboard}
        />
      )}
      {selectedOption === SidebarOptions.advancedMapSettings && (
        <AdvancedSettings venue={venue as Venue_v2} onSave={selectDashboard} />
      )}
    </>
  );
};
