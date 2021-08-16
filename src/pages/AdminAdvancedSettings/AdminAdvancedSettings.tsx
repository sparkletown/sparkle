import React, { useCallback, useMemo, useState } from "react";
import { Nav } from "react-bootstrap";
import classNames from "classnames";

import { Venue_v2 } from "types/venues";

import { useUser } from "hooks/useUser";
import { useIsAdminUser } from "hooks/roles";
import { useVenueId } from "hooks/useVenueId";
import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

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

const adminAdvancedTabLabelMap: Readonly<Record<AdminAdvancedTab, String>> = {
  [AdminAdvancedTab.basicInfo]: "Start",
  [AdminAdvancedTab.entranceExperience]: "Entrance",
  [AdminAdvancedTab.advancedMapSettings]: "Advanced",
};

const DEFAULT_TAB = AdminAdvancedTab.basicInfo;

export const AdminAdvancedSettings: React.FC = () => {
  const venueId = useVenueId();
  const { sovereignVenue } = useSovereignVenue({ venueId });
  const [selectedTab, setSelectedTab] = useState<AdminAdvancedTab>(DEFAULT_TAB);

  const { userId } = useUser();
  const { isAdminUser } = useIsAdminUser(userId);

  const selectDefaultTab = useCallback(() => {
    setSelectedTab(DEFAULT_TAB);
  }, []);

  const {
    currentVenue: venue,
    isCurrentVenueLoaded,
  } = useConnectCurrentVenueNG(venueId);

  const renderAdminAdvancedTabs = useMemo(() => {
    return Object.entries(adminAdvancedTabLabelMap).map(([key, text]) => (
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

  const selectTab = useCallback((tab: string) => {
    setSelectedTab(tab as AdminAdvancedTab);
  }, []);

  if (!isCurrentVenueLoaded) {
    return <LoadingPage />;
  }

  if (!isAdminUser) {
    return <>Forbidden</>;
  }

  return (
    <>
      <div className="AdminAdvancedSettings">
        <Nav
          className="AdminAdvancedSettings__options"
          activeKey={selectedTab}
          onSelect={selectTab}
        >
          {renderAdminAdvancedTabs}
        </Nav>
      </div>
      {selectedTab === AdminAdvancedTab.basicInfo && <VenueWizard />}
      {selectedTab === AdminAdvancedTab.entranceExperience && (
        <EntranceExperience
          // @debt Venue_v2 has different structure than AnyVenue, 1 of them should be deprecated.
          venue={venue as Venue_v2}
          sovereignVenue={sovereignVenue}
          onSave={selectDefaultTab}
        />
      )}
      {selectedTab === AdminAdvancedTab.advancedMapSettings && (
        <AdvancedSettings venue={venue as Venue_v2} onSave={selectDefaultTab} />
      )}
    </>
  );
};
