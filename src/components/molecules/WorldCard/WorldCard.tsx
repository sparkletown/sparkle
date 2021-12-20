import React from "react";
import { useCss } from "react-use";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import { ADMIN_IA_WORLD_PARAM_URL, DEFAULT_VENUE_LOGO } from "settings";

import { World } from "api/world";

import { WithId } from "utils/id";
import { generateUrl } from "utils/url";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./WorldCard.scss";

export interface WorldCardProps {
  world: WithId<World>;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world }) => {
  const cardVars = useCss({
    backgroundImage: `url(${world.config?.landingPageConfig?.coverImageUrl})`,
  });

  const cardClasses = classNames("WorldCard", cardVars, {
    "WorldCard--disabled": !world.slug,
  });

  const logoVars = useCss({
    backgroundImage: `url(${world.host?.icon ?? DEFAULT_VENUE_LOGO})`,
  });

  const logoClasses = classNames("WorldCard__logo", logoVars);

  return (
    <div className={cardClasses}>
      <div className="WorldCard__info">
        <div className={logoClasses} />
        <div className="WorldCard__titles">
          <div className="WorldCard__world-name">{world.name}</div>
          <div className="WorldCard__world-description">
            {world.config?.landingPageConfig?.description}
          </div>
        </div>
      </div>
      <ButtonNG
        variant="dark"
        isLink
        disabled={!world.slug}
        linkTo={generateUrl({
          route: ADMIN_IA_WORLD_PARAM_URL,
          required: ["worldSlug"],
          params: { worldSlug: world.slug },
        })}
        iconName={faSignInAlt}
        className="WorldCard__button"
      >
        Enter dashboard
      </ButtonNG>
    </div>
  );
};
