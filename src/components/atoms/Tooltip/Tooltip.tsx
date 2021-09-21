import React, { useEffect, useState } from "react";
import { useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_MESSAGES } from "assets/messages";

import "./Tooltip.scss";

const findMessage: (key: string) => string = (key) => DEFAULT_MESSAGES[key];

type TooltipProps = {
  label: string | string[];
};

export const Tooltip: React.FC<TooltipProps> = ({ label, children }) => {
  const [tooltipLabel, updateTooltipLabel] = useState("");
  const [isShow, updateShow] = useState(false);
  const [tooltipLocation, updateLocation] = useState({ top: "0", left: "0" });

  useEffect(() => {
    if (typeof label === "string") {
      updateTooltipLabel(findMessage(label) ?? label);
      // return <>{findMessage(label) ?? label}</>;
    }

    if (Array.isArray(label)) {
      updateTooltipLabel(findMessage(label.join("")) ?? label);
      // return <>{findMessage(label.join("")) ?? label}</>;
    }
  }, [label]);

  const handleMouseOver = (e: MouseEvent) => {
    updateLocation({ top: `${e.clientY}px`, left: `${e.clientX}px` });
    updateShow(true);
  };

  const handleMouseOut = () => {
    updateShow(false);
  };

  const copy = React.Children.map(children, (child: React.ReactNode) => {
    const item = child as React.ReactElement;

    React.cloneElement(item, {
      onMouseOver: handleMouseOver,
      onMouseLeave: handleMouseOut,
    });
  });

  const tooltipVars = useCss(tooltipLocation);
  const tooltipClasses = classNames(
    "tooltipmain__label",
    {
      "tooltipmain__label--visible": isShow,
    },
    tooltipVars
  );

  return (
    <>
      <div className="tooltipmain">
        <>{copy}</>
        <div className={tooltipClasses}>{tooltipLabel}</div>
      </div>
    </>
  );
};
