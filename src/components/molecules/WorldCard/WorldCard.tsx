import React from "react";
import { faCog, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import { DEFAULT_VENUE_LOGO } from "settings";

import { World } from "api/admin";

import { WithId } from "utils/id";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./WorldCard.scss";

export interface WorldCardProps {
  world: WithId<World>;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world }) => (
  <div
    className="WorldCard"
    style={{
      backgroundImage: `url(${world.config.landingPageConfig.coverImageUrl})`,
    }}
  >
    <div className="WorldCard__info">
      <div
        className="WorldCard__logo"
        style={{
          backgroundImage: `url(${world.host?.icon ?? DEFAULT_VENUE_LOGO})`,
        }}
      />
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
    <ButtonNG variant="dark" iconName={faCog} className="WorldCard__button">
      Configure world
    </ButtonNG>
  </div>
);
