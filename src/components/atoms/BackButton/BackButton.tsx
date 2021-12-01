import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { EMPTY_WORLD_SLUG } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { useAdminContextCheck } from "hooks/useAdminContextCheck";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import "./BackButton.scss";

export interface BackButtonProps {
  locationName?: string;
  space?: WithId<AnyVenue>;
  variant: "simple" | "relative" | "external";
}

export const BackButton: React.FC<BackButtonProps> = ({
  locationName,
  space,
  variant,
}) => {
  const { worldSlug } = useWorldParams();
  const spaceSlug = space?.slug;
  const displayName = locationName ?? space?.name;
  const backButtonText = displayName ? `Back to ${displayName}` : "Back";

  const {
    push: customOpenRelativeUrl,
    replace: customOpenExternalUrl,
  } = useHistory();

  const handleClick = useCallback(() => {
    if (!spaceSlug) return;

    if (variant === "relative") {
      return enterVenue(worldSlug ?? EMPTY_WORLD_SLUG, spaceSlug, {
        customOpenRelativeUrl,
      });
    }

    if (variant === "external") {
      return enterVenue(worldSlug ?? EMPTY_WORLD_SLUG, spaceSlug, {
        customOpenExternalUrl,
      });
    }

    return enterVenue(worldSlug ?? EMPTY_WORLD_SLUG, spaceSlug);
  }, [
    worldSlug,
    spaceSlug,
    variant,
    customOpenExternalUrl,
    customOpenRelativeUrl,
  ]);

  const isAdminContext = useAdminContextCheck();
  if (isAdminContext) {
    return null;
  }

  return (
    <div className="BackButton" onClick={handleClick}>
      <FontAwesomeIcon
        className="BackButton__icon"
        icon={faChevronLeft}
        size="sm"
      />
      <span className="BackButton__label">{backButtonText}</span>
    </div>
  );
};
