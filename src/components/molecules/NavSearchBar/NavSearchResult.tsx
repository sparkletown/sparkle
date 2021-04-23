import React, { useMemo } from "react";

import { UserAvatar } from "components/atoms/UserAvatar";

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

  return (
    <div className="NavSearchResult font-size--small" onClick={onClick}>
      {isAvatar ? (
        <UserAvatar
          avatarSrc={image}
          containerClassName="NavSearchResult__avatar"
        />
      ) : (
        <div className="NavSearchResult__image" style={imageStyles} />
      )}

      <div className="NavSearchResult__content">
        <div>{title}</div>
        <div className="NavSearchResult__description">{description}</div>
      </div>
    </div>
  );
};
