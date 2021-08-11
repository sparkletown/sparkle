import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import "./WelcomePopUp.scss";

export interface WelcomePopUpProps {}

export const WelcomePopUp: React.FC<WelcomePopUpProps> = () => {
  const isFirstEntrance = true; //TODO: request to data layer
  const [isVisible, setIsVisible] = useState(isFirstEntrance);

  return (
    <Modal show={isVisible} size="lg" centered>
      <Modal.Body>
        <div className="WelcomePopUp">
          <h2 className="WelcomePopUp__title">
            Welcome to The SparkleVerse Online Burn!
          </h2>
          <div className="WelcomePopUp__desc">
            First time here? Welcome home. Click anywhere to place your avatar
            and join the map.
          </div>
          <Button
            className="WelcomePopUp__accept-button"
            onClick={() => setIsVisible(false)}
          >
            Enter
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
