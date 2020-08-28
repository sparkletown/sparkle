import React from "react";
import { OverlayTrigger } from "react-bootstrap";

import "./OverlayMenu.scss";

export type MenuConfig = {
  prompt?: string;
  choices?: MenuChoice[];
};

type MenuChoice = {
  text: string;
  onClick: () => void;
};

interface PropsType {
  config: MenuConfig;
}

const OverlayMenu: React.FunctionComponent<React.PropsWithChildren<
  PropsType
>> = ({ config, children }) => {
  const menu = (
    <div className="overlay-menu">
      <div className="prompt">{config.prompt}</div>
      {config.choices?.map((choice, index) => (
        <div className="choice" onClick={choice.onClick} key={index}>
          {choice.text}
        </div>
      ))}
    </div>
  );
  return (
    <OverlayTrigger
      trigger="click"
      placement="right-start"
      delay={{ show: 250, hide: 400 }}
      rootClose
      overlay={menu}
    >
      <div>{children}</div>
    </OverlayTrigger>
  );
};

export default OverlayMenu;
