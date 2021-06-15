import React, { MouseEventHandler } from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

import "./Bookmark.scss";

export interface BookmarkProps {
  containerClassName?: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  isSaved: boolean;
}

export const Bookmark: React.FC<BookmarkProps> = ({
  containerClassName,
  onClick,
  isSaved,
}) => {
  return (
    <div
      className={classNames("Bookmark", containerClassName)}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={isSaved ? solidBookmark : regularBookmark} />
    </div>
  );
};
