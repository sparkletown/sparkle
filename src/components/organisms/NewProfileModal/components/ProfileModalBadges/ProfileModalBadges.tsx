import React from "react";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { Badges } from "components/organisms/Badges";

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
