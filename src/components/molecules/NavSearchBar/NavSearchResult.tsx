import React, { useMemo } from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./NavSearchResult.scss";

export interface NavSearchResultProps {
  title: string;
  description?: string;
  image?: string;
  user?: WithId<User>;
  onClick?: (e?: React.MouseEvent) => void;
}

export const NavSearchResult: React.FC<NavSearchResultProps> = ({
  title,
  description,
  image,
  user,
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
      {user ? (
        <UserAvatar
          viewingUser={user}
          showStatus
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
