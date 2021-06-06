import React, { MouseEventHandler } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

import "./Bookmark.scss";

export interface BookmarkProps {
  className?: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  isSaved: boolean;
}

export const Bookmark: React.FC<BookmarkProps> = ({
  className = "Bookmark",
  onClick,
  isSaved,
}) => {
  return (
    <div className={className} onClick={onClick}>
      <FontAwesomeIcon icon={isSaved ? solidBookmark : regularBookmark} />
    </div>
  );
};
