import React, { useCallback } from "react";
import { Link, LinkProps, useHistory } from "react-router-dom";
import classNames from "classnames";

import { useKeyPress } from "hooks/useKeyPress";

import "./PrettyLink.scss";

const HANDLED_KEY_PRESSES = ["Enter"];

interface PrettyLinkProps extends Omit<LinkProps, "to"> {
  className?: string;
  onClick?: () => void;
  title?: string;
  to?: string;
}

export const PrettyLink: React.FC<PrettyLinkProps> = ({
  children,
  className,
  onClick,
  title,
  to,
  ...extraProps
}) => {
  const history = useHistory();
  const navigateTo = useCallback(() => to && history.push(to), [to, history]);

  const handleKeyPress = useKeyPress({
    keys: HANDLED_KEY_PRESSES,
    onPress: onClick ?? navigateTo,
  });

  const contents = children ?? title ?? null;
  const parentClasses = classNames("PrettyLink", className);

  return (
    <div className={parentClasses}>
      {to ? (
        <span
          className="PrettyLink__wrapper PrettyLink__wrapper--actual-link"
          title={title}
        >
          <Link
            className="PrettyLink__link"
            {...extraProps}
            onClick={onClick} // onClick is part of Link props, don't starve it
            to={to}
          >
            {contents}
          </Link>
        </span>
      ) : (
        <span
          className="PrettyLink__wrapper PrettyLink__wrapper--raw-contents"
          title={title}
          onClick={onClick}
          onKeyPress={handleKeyPress}
          tabIndex={0} // Makes it friendly to keyboard navigation
        >
          {contents}
        </span>
      )}
    </div>
  );
};
