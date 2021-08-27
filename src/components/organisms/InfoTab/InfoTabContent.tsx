import React, { FC } from "react";

import { AnyVenue, GenericVenue } from "types/venues";

import { useRecentVenueUsers } from "hooks/users";

import { UserList } from "components/molecules/UserList";

import { InfoTabLogo } from "./InfoTabLogo";

interface InfoTabContentProps {
  venue?: AnyVenue | GenericVenue;
}

export const InfoTabContent: FC<InfoTabContentProps> = ({ venue }) => {
  const { recentVenueUsers } = useRecentVenueUsers({ venueName: venue?.name });

  const name = venue?.name;
  const iconNameOrPath = venue?.host?.icon;
  const subtitle = venue?.config?.landingPageConfig.subtitle;
  const description = venue?.config?.landingPageConfig.description;

  return (
    <>
      <div className="InfoTab__title">{name}</div>
      <div className="InfoTab__body">
        <InfoTabLogo iconNameOrPath={iconNameOrPath} isInfoTabShown />
        <div className="InfoTab__bodyRight">
          <div className="InfoTab__subtitle">{subtitle}</div>
          <UserList
            containerClassName="InfoTab__userList"
            hasClickableAvatars
            users={recentVenueUsers}
            activity="here"
            limit={6}
          />
        </div>
      </div>
      <div className="InfoTab__description">{description}</div>
    </>
  );
};
