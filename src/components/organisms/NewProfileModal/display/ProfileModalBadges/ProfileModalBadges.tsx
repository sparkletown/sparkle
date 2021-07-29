import React from "react";
import { WithId } from "../../../../../utils/id";
import { AnyVenue } from "../../../../../types/venues";
import { Badges } from "../../../Badges";
import { ContainerClassName } from "../../../../../types/utility";
import { User } from "../../../../../types/User";

interface Props extends ContainerClassName {
  user: WithId<User>;
  venue: WithId<AnyVenue>;
}

export const ProfileModalBadges: React.FC<Props> = ({
  venue,
  user,
  containerClassName,
}) => {
  return (
    <>
      {venue?.showBadges && user && (
        <Badges
          containerClassName={containerClassName}
          user={user}
          currentVenue={venue}
        />
      )}
    </>
  );
};
