import React, { useCallback, useMemo, useState } from "react";
import { Nav } from "react-bootstrap";
import classNames from "classnames";

import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useUser } from "hooks/useUser";
import { useRoles } from "hooks/useRoles";
import { useIsAdminUser } from "hooks/roles";

import { Venue_v2 } from "types/venues";

import AdvancedSettings from "pages/Admin/AdvancedSettings";
import EntranceExperience from "pages/Admin/EntranceExperience";
import VenueWizard from "pages/Admin/Venue/VenueWizard/VenueWizard";
import { LoadingPage } from "components/molecules/LoadingPage";

import "./AdminAdvancedSettings.scss";

export enum AdminAdvancedTab {
  basicInfo = "basic_info",
  entranceExperience = "entrance_experience",
  advancedMapSettings = "advanced_map_settings",
}

const adminAdvancedTabs: Readonly<Record<AdminAdvancedTab, String>> = {
  [AdminAdvancedTab.basicInfo]: "Start",
  [AdminAdvancedTab.entranceExperience]: "Entrance",
  [AdminAdvancedTab.advancedMapSettings]: "Advanced",
};

const DEFAULT_TAB = AdminAdvancedTab.basicInfo;

export const AdminAdvancedSettings: React.FC = () => {
  const venueId = useVenueId();
  const [selectedTab, setSelectedTab] = useState<string>(DEFAULT_TAB);

  const { user } = useUser();
  const { roles } = useRoles();
  const { isAdminUser } = useIsAdminUser(user?.uid);

  const selectDefaultTab = useCallback(() => {
    setSelectedTab(DEFAULT_TAB);
  }, []);

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const renderAdminAdvancedTabs = useMemo(() => {
    return Object.entries(adminAdvancedTabs).map(([key, text]) => (
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
      <div className="AdminAdvancedSettings">
        <Nav
          className="AdminAdvancedSettings__options"
          activeKey={selectedTab}
          onSelect={setSelectedTab}
        >
          {renderAdminAdvancedTabs}
        </Nav>
      </div>
      {selectedTab === AdminAdvancedTab.basicInfo && <VenueWizard />}
      {selectedTab === AdminAdvancedTab.entranceExperience && (
        <EntranceExperience
          // @debt Venue_v2 has different structure than AnyVenue, 1 of them should be deprecated.
          venue={venue as Venue_v2}
          onSave={selectDefaultTab}
        />
      )}
      {selectedTab === AdminAdvancedTab.advancedMapSettings && (
        <AdvancedSettings venue={venue as Venue_v2} onSave={selectDefaultTab} />
      )}
    </>
  );
};
