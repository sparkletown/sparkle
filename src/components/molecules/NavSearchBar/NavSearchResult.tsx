import React, { useMemo } from "react";
import classNames from "classnames";

import "./NavSearchResult.scss";

export interface NavSearchResultProps {
  title: string;
  description?: string;
  image?: string;
  isAvatar?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
}

export const NavSearchResult: React.FC<NavSearchResultProps> = ({
  title,
  description,
  image,
  isAvatar,
  onClick,
}) => {
  const imageStyles = useMemo(
    () => ({
      backgroundImage: image ? `url(${image})` : undefined,
    }),
    [image]
  );

  const imageClasses = useMemo(
    () =>
      classNames("NavSearchResult__image", {
        NavSearchResult__avatar: isAvatar,
      }),
    [isAvatar]
  );

  return (
    <div className="NavSearchResult font-size--small" onClick={onClick}>
      <div className={imageClasses} style={imageStyles} />

      <div className="NavSearchResult__content">
        <div>{title}</div>
        <div className="NavSearchResult__description">{description}</div>
      </div>
    </div>
  );
};
