import React from "react";
import { useCss } from "react-use";
import { faCog, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import { DEFAULT_VENUE_LOGO } from "settings";

import { World } from "api/admin";

import { WithId } from "utils/id";
import { adminWorldUrl } from "utils/url";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./WorldCard.scss";

export interface WorldCardProps {
  world: WithId<World>;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world }) => {
  const cardVars = useCss({
    backgroundImage: `url(${world.config.landingPageConfig.coverImageUrl})`,
  });

  const cardClasses = classNames("WorldCard", cardVars);

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
            {world.config.landingPageConfig.description}
          </div>
        </div>
      </div>
      <ButtonNG
        variant="dark"
        iconName={faSignInAlt}
        className="WorldCard__button"
      >
        Enter dashboard
      </ButtonNG>
      <ButtonNG
        isLink
        linkTo={adminWorldUrl(world.id)}
        variant="dark"
        iconName={faCog}
        className="WorldCard__button"
      >
        Configure world
      </ButtonNG>
    </div>
  );
};