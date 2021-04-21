import React from "react";

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
  const imageStyles = {
    backgroundImage: image ? `url(${image})` : undefined,
  };

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

      <div>
        <div>{title}</div>
        <div className="font-size--small NavSearchResult__description">
          {description}
        </div>
      </div>
    </div>
  );
};
