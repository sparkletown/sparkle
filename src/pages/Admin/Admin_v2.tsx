import React, { useMemo, useState } from "react";
import "firebase/storage";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

// Components
import AuthenticationModal from "components/organisms/AuthenticationModal";
import VenueDetails from "./Venue/Details";

// Hooks
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import useRoles from "hooks/useRoles";
import { useIsAdminUser } from "hooks/roles";

// Styles
import "./Admin.scss";
import { Venue_v2 } from "types/venues";
import { AuthOptions } from "components/organisms/AuthenticationModal/AuthenticationModal";
import AdminSidebar from "./Sidebar/Sidebar";
import { useVenueId } from "hooks/useVenueId";
import { orderedVenuesSelector } from "utils/selectors";
import { useAdminVenues } from "hooks/useAdminVenues";
import EntranceExperience from "./EntranceExperience";
import AdvancedSettings from "./AdvancedSettings";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";
// import TicketingAndAccess from "./TicketingAndAccess";

import * as S from "./Admin.styles";
import BasicInfo from "./BasicInfo";

dayjs.extend(advancedFormat);

export type SidebarOption = {
  id: string;
  text: string;
  redirectTo?: string;
};
enum SidebarOptions {
  dashboard = "dashboard",
  basicInfo = "basic_info",
  entranceExperience = "entrance_experience",
  advancedMapSettings = "advanced_map_settings",
  ticketingAndAccess = "ticketing_and_access",
}
const sidebarOptions: SidebarOption[] = [
  {
    id: SidebarOptions.dashboard,
    text: "Dashboard",
  },
  {
    id: SidebarOptions.basicInfo,
    text: "Basic info",
  },
  {
    id: SidebarOptions.entranceExperience,
    text: "Entrance experience",
  },
  {
    id: SidebarOptions.advancedMapSettings,
    text: "Advanced map settings",
  },
  // TODO: Reintroduce when field is decided what to include
  // {
  //   id: SidebarOptions.ticketingAndAccess,
  //   text: "Ticketing and access",
  // },
];

const Admin_v2: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(sidebarOptions[0].id);

  const { user } = useUser();
  useAdminVenues(user?.uid);

  const venues = useSelector(orderedVenuesSelector);
  const venueId = useVenueId();

  const selectedVenue = useMemo(() => venues?.find((v) => v.id === venueId), [
    venueId,
    venues,
  ]);

  const { roles } = useRoles();

  const { isAdminUser } = useIsAdminUser(user?.uid);

  if (!venues || !roles) {
    return <>Loading...</>;
  }

  if (!user) {
    return <>You need to log in first.</>;
  }

  if (!roles.includes("admin") || !isAdminUser) {
    return <>Forbidden</>;
  }

  const renderVenueView = () => {
    switch (selectedOption) {
      case SidebarOptions.dashboard:
        return (
          <VenueDetails
            venue={selectedVenue as Venue_v2}
            onSave={() => setSelectedOption(sidebarOptions[0].id)}
          />
        ); // Venue_v2 is incomplete with typing (lags behind latest Venue)

      case SidebarOptions.basicInfo:
        return (
          <BasicInfo
            venue={selectedVenue as Venue_v2}
            onSave={() => setSelectedOption(sidebarOptions[0].id)}
          />
        );

      case SidebarOptions.entranceExperience:
        return (
          <EntranceExperience
            venue={selectedVenue as Venue_v2}
            onSave={() => setSelectedOption(sidebarOptions[0].id)}
          />
        );

      case SidebarOptions.advancedMapSettings:
        return (
          <AdvancedSettings
            venue={selectedVenue as Venue_v2}
            onSave={() => setSelectedOption(sidebarOptions[0].id)}
          />
        );

      // case SidebarOptions.ticketingAndAccess:
      //   return <TicketingAndAccess />;

      default:
        return null;
    }
  };

  return (
    <WithNavigationBar fullscreen>
      <S.Wrapper>
        <AdminSidebar
          sidebarOptions={sidebarOptions}
          selected={selectedOption}
          onClick={setSelectedOption}
        />

        <S.ViewWrapper>
          {selectedVenue ? (
            renderVenueView()
          ) : (
            <span className="no-venue-selected">
              Select a venue to see its details
            </span>
          )}
        </S.ViewWrapper>
      </S.Wrapper>

      <AuthenticationModal
        show={!user}
        onHide={() => {}}
        showAuth={AuthOptions.login}
      />
    </WithNavigationBar>
  );
};

export default Admin_v2;
