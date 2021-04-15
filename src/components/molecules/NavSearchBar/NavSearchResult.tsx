import React from "react";
import classNames from "classnames";

import "./NavSearchResult.scss";

interface NavSearchResultProps {
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
  return (
    <div className="nav-dropdown--search-result" onClick={onClick}>
      <div
        className={classNames("nav-dropdown--search-result-image", {
          "nav-dropdown--search-result-avatar": isAvatar,
        })}
        style={{
          backgroundImage: image ? `url(${image})` : "",
        }}
      />
      <div className="nav-dropdown--search-result-title">
        <div className="result-title">{title}</div>
        <div className="font-size--small opacity-6">{description}</div>
      </div>
    </div>
  );
};
