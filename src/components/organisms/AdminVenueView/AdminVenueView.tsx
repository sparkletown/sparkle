import React, { useCallback, useMemo, useState } from "react";
import { Button, Nav } from "react-bootstrap";
import classNames from "classnames";

import AdvancedSettings from "pages/Admin/AdvancedSettings";
import EntranceExperience from "pages/Admin/EntranceExperience";
import VenueDetails from "pages/Admin/Venue/Details";
import VenueWizard from "pages/Admin/Venue/VenueWizard/VenueWizard";

import { Venue_v2 } from "types/venues";

import "./AdminVenueView.scss";
import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

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

const DEFAULT_EDIT_TAB = sidebarOptions.findIndex(
  (option) => option.id === SidebarOptions.dashboard
);

const DEFAULT_CREATE_TAB = sidebarOptions.findIndex(
  (option) => option.id === SidebarOptions.basicInfo
);

export interface AdminVenueViewProps {
  onClickBackButton: () => void;
}
export const AdminVenueView: React.FC<AdminVenueViewProps> = ({onClickBackButton}) => {
  const venueId = useVenueId();

  const { currentVenue } = useConnectCurrentVenueNG(venueId);

  const defaultTab = useMemo(() => {
    return venueId ? DEFAULT_EDIT_TAB : DEFAULT_CREATE_TAB;
  }, [venueId]);

  const [selectedOption, setSelectedOption] = useState(
    sidebarOptions[defaultTab].id
  );

  const selectDefaultTab = useCallback(() => {
    setSelectedOption(sidebarOptions[defaultTab].id);
  }, [defaultTab]);

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

  const venue = currentVenue as Venue_v2

  return (
    <>
      <div className="AdminVenueView">
       <Button onClick={onClickBackButton}>Back</Button>

        <Nav
          className="AdminVenueView__options"
          activeKey={selectedOption}
          onSelect={setSelectedOption}
        >
          {renderSidebarOptions}
        </Nav>
      </div>
      {selectedOption === SidebarOptions.basicInfo && (
        <VenueWizard />
      )}
      {selectedOption === SidebarOptions.entranceExperience && (
        <EntranceExperience venue={venue} onSave={selectDefaultTab} />
      )}
      {selectedOption === SidebarOptions.advancedMapSettings && (
        <AdvancedSettings venue={venue} onSave={selectDefaultTab} />
      )}
      {selectedOption === SidebarOptions.dashboard && (
        <VenueDetails venue={venue} />
      )}
    </>
  );
};
