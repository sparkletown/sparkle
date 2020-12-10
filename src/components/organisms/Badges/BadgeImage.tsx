import React, {
  RefObject,
  useCallback,
} from "react";

export const BadgeImage: React.FC<{
  badgeImgRefs: RefObject<HTMLImageElement[]>;
  image?: string;
  label: string;
  index: number;
}> = ({ badgeImgRefs, image, label, index }) => {
  const defaultAvatar = '/icons/sparkle-nav-logo.png'

  const changeBadgeImage = useCallback(() => {
    if (!badgeImgRefs.current?.[index]) return;

    badgeImgRefs.current[index].src = defaultAvatar;
    }, [badgeImgRefs, index])

  return (
      <img
              className="badge-list-item-image"
              ref={(ref) => {
                if (ref && badgeImgRefs.current) {
                  badgeImgRefs.current.push(ref);
                }
              }}
              src={image ?? defaultAvatar}
              alt={`${label} badge`}
              onError={changeBadgeImage}
            />
  );
};
