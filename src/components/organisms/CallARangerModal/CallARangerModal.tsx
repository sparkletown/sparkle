import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { CallARangerHeader } from "components/organisms/CallARangerModal/components/CallARangerHeader";
import { CallARangerInfo } from "components/organisms/CallARangerModal/components/CallARangerInfo";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./CallARangerModal.scss";

export interface CallARangerModalProps extends ContainerClassName {
  show: boolean;
  onHide: () => void;
}

export const CallARangerModal: React.FC<CallARangerModalProps> = ({
  show,
  onHide,
  containerClassName,
}) => {
  const handleClick = useCallback(() => {
    window.open("https://multiverserangers.org/rangers911/");
  }, []);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className={classNames("CallARangerModal", containerClassName)}
    >
      <CallARangerHeader
        containerClassName="CallARangerModal__header"
        onCloseClick={onHide}
      />
      <div className="CallARangerModal__footer">
        <h3>How can we help?</h3>
        <div className="CallARangerModal__footer-info-container">
          <CallARangerInfo title={"Block title here"}>
            Lorem ipsum dolor sin amet lorem ispum dolor sin amet lorem ipsum
            dolor sin amet r sin amet ispum
          </CallARangerInfo>
          <CallARangerInfo title={"Block title here"}>
            Lorem ipsum dolor sin amet lorem ispum dolor sin amet lorem ipsum
            dolor sin amet r sin amet ispum
          </CallARangerInfo>
          <CallARangerInfo title={"Block title here"}>
            Lorem ipsum dolor sin amet lorem ispum dolor sin amet lorem ipsum
            dolor sin amet r sin amet ispum
          </CallARangerInfo>
        </div>
        <ButtonNG variant="primary" onClick={handleClick}>
          Call a Ranger
        </ButtonNG>
      </div>
    </Modal>
  );
};
