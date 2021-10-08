import React from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import {
  DEFAULT_LANDING_BANNER,
  DEFAULT_PROFILE_IMAGE,
  DEFAULT_VENUE_LOGO,
} from "settings";

import { World } from "api/admin";

import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import "./WorldShowcase.scss";

export interface WorldShowcaseProps {
  world?: WithId<World>;
}

export const WorldShowcase: React.FC<WorldShowcaseProps> = ({ world }) => {
  const { profile } = useUser();
  const avatar = profile?.pictureUrl ?? DEFAULT_PROFILE_IMAGE;
  const banner =
    world?.config?.landingPageConfig?.coverImageUrl ?? DEFAULT_LANDING_BANNER;
  const logo = world?.host?.icon ?? DEFAULT_VENUE_LOGO;
  const name = world?.name;

  const bannerClasses = classNames(
    "WorldShowcase__highlight",
    useCss({
      "background-image": `url(${banner})`,
    })
  );

  const avatarClasses = classNames(
    "WorldShowcase__profile",
    useCss({
      "background-image": `url(${avatar}`,
    })
  );

  const logoClasses = classNames(
    "WorldShowcase__logo",
    useCss({
      "background-image": `url(${logo}`,
    })
  );

  console.log(WorldShowcase.name, world);

  return (
    <section className="WorldShowcase">
      <div className="WorldShowcase__nav">
        <div className="WorldShowcase__sparkle" />
        <div className="WorldShowcase__title">{name}</div>
        <div className={avatarClasses} />
      </div>
      <div className={bannerClasses}>
        <div className="WorldShowcase__content">
          <div className={logoClasses} />
          <div className="WorldShowcase__caption">{name}</div>
        </div>
      </div>
    </section>
  );
};
