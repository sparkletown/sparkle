import React, { useCallback, useRef } from "react";

import { DEFAULT_BADGE_IMAGE } from "settings";

// @debt Refactor this to use our useImage hook?
export const BadgeImage: React.FC<{
  image?: string;
  name: string;
}> = ({ image, name }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const changeBadgeImage = useCallback(() => {
    if (!imageRef.current) return;

    imageRef.current.src = DEFAULT_BADGE_IMAGE;
  }, []);

  const badgeLabel = `${name} Badge`;

  return (
    <img
      className="Badges__item-image"
      ref={imageRef}
      src={image ?? DEFAULT_BADGE_IMAGE}
      title={badgeLabel}
      alt={badgeLabel}
      onError={changeBadgeImage}
    />
  );
};
