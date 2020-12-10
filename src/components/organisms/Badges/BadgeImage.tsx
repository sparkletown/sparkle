import React, { useCallback, useRef } from "react";

const defaultAvatar = "/icons/sparkle-nav-logo.png";

export const BadgeImage: React.FC<{
  image?: string;
}> = ({ image }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const changeBadgeImage = useCallback(() => {
    if (!imageRef.current) return;

    imageRef.current.src = defaultAvatar;
  }, []);

  return (
    <img
      className="badge-list-item-image"
      ref={imageRef}
      src={image}
      alt={""}
      onError={changeBadgeImage}
    />
  );
};
