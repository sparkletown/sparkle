import React from "react";
import { useCss } from "react-use";
import classNames from "classnames";

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
  const avatar = determineAvatar({ user });
  const banner =
    dirty?.bannerImageUrl ||
    (world?.config?.landingPageConfig?.coverImageUrl ?? DEFAULT_LANDING_BANNER);
  const logo = dirty?.logoImageUrl || (world?.host?.icon ?? DEFAULT_VENUE_LOGO);
  const name = dirty?.name || world?.name;

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
