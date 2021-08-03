import React from "react";
import { WithId } from "utils/id";
import { AnyVenue } from "types/venues";
import { Badges } from "components/organisms/Badges";
import { ContainerClassName } from "types/utility";
import { User } from "types/User";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
  venue: WithId<AnyVenue>;
}

export const ProfileModalBadges: React.FC<Props> = ({
  venue,
  viewingUser,
  containerClassName,
}) => {
  return (
    <>
      {venue?.showBadges && viewingUser && (
        <Badges
          containerClassName={containerClassName}
          user={viewingUser}
          currentVenue={venue}
        />
      )}
    </>
  );
};
