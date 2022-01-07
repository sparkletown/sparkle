import React from "react";

import { DEFAULT_LANDING_BANNER, DEFAULT_VENUE_LOGO } from "settings";

import { World } from "api/world";

import { WithId } from "utils/id";
import { determineAvatar } from "utils/image";
import { worldEditStartValuesSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import "./WorldShowcase.scss";

export interface WorldShowcaseProps {
  world?: WithId<World>;
}

export const WorldShowcase: React.FC<WorldShowcaseProps> = ({ world }) => {
  // NOTE: values can also be empty strings, not just missing
  const dirty = useSelector(worldEditStartValuesSelector);
  const { profile: user } = useUser();
  // TODO-redesign - use these variables or delete them
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { src: avatar } = determineAvatar({ user });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const banner =
    dirty?.bannerImageUrl ||
    (world?.config?.landingPageConfig?.coverImageUrl ?? DEFAULT_LANDING_BANNER);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const logo = dirty?.logoImageUrl || (world?.host?.icon ?? DEFAULT_VENUE_LOGO);
  const name = dirty?.name || world?.name;

  return (
    <section className="WorldShowcase">
      <div className="WorldShowcase__nav">
        <div className="WorldShowcase__sparkle" />
        <div className="WorldShowcase__title">{name}</div>
        <div />
      </div>
      <div>
        <div className="WorldShowcase__content">
          <div />
          <div className="WorldShowcase__caption">{name}</div>
        </div>
      </div>
    </section>
  );
};
