import React, { useCallback, useRef } from "react";
import { DEFAULT_AVATAR_IMAGE } from "settings";

export const BadgeImage: React.FC<{
  image?: string;
  name: string;
}> = ({ image, name }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const changeBadgeImage = useCallback(() => {
    if (!imageRef.current) return;

    imageRef.current.src = DEFAULT_AVATAR_IMAGE;
  }, []);

  const badgeLabel = `${name} Badge`;

  return (
    <img
      className="badge-list-item-image"
      ref={imageRef}
      src={image ?? DEFAULT_AVATAR_IMAGE}
      title={badgeLabel}
      alt={badgeLabel}
      onError={changeBadgeImage}
    />
  );
};
