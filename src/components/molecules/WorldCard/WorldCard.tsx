import React from "react";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import { ADMIN_IA_WORLD_PARAM_URL } from "settings";

import { World } from "api/world";

import { WithId } from "utils/id";
import { generateUrl } from "utils/url";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./WorldCard.scss";

export interface WorldCardProps {
  world: WithId<World>;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world }) => {
  // TODO-redesign
  // Probably want to include these variables in this component:
  // - world.config?.landingPageConfig?.coverImageUrl
  // - world.host?.icon ?? DEFAULT_VENUE_LOGO

  return (
    <div>
      <div className="WorldCard__info">
        <div />
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
