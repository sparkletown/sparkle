import React from "react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { ButtonNG } from "components/atoms/ButtonNG";

import { AnimateMapOnboardFlowProps } from "./AnimateMapOnboardFlowProps";

import "./AnimateMapOnboardModal.scss";

export interface AnimateMapOnboardModalContentProps {
  className?: string;
  descriptionBottom?: string;
  descriptionTop?: string;
  disabledNext?: boolean;
  nextText?: string;
  posterAlt?: string;
  posterSrc?: string;
  show?: boolean;
  skipText?: string;
  title?: string;
}

export type AnimateMapOnboardModalProps = AnimateMapOnboardFlowProps &
  AnimateMapOnboardModalContentProps;

export const AnimateMapOnboardModal: React.FC<AnimateMapOnboardModalProps> = ({
  className = "",
  descriptionBottom,
  descriptionTop,
  disabledNext = false,
  nextText = "Next",
  onNext,
  onSkip,
  posterAlt,
  posterSrc,
  show = false,
  skipText = "Skip",
  title,
  children,
}) => {
  // No point in keeping this component and its children in DOM if it is not visible
  if (!show) {
    return <></>;
  }

  return (
    <Modal
      centered
      dialogClassName={classNames({
        "AnimateMapOnboardModal AnimateMapOnboardModal__dialog ": true,
        [className]: className,
      })}
      show={true}
      onHide={() =>
        console.warn(
          "Automatic hiding of this window by clicking outside is not allowed. Please use the skip button."
        )
      }
    >
      <Modal.Title className="AnimateMapOnboardModal__title">
        {title}
      </Modal.Title>
      <Modal.Body className="AnimateMapOnboardModal__body">
        {descriptionTop && (
          <div className="AnimateMapOnboardModal__description AnimateMapOnboardModal__description-top">
            {descriptionTop}
          </div>
        )}
        {posterSrc && (
          <img
            className="AnimateMapOnboardModal__poster"
            alt={posterAlt}
            src={posterSrc}
          />
        )}
        <div className="AnimateMapOnboardModal__children">{children}</div>
        {descriptionBottom && (
          <div className="AnimateMapOnboardModal__description AnimateMapOnboardModal__description-bottom">
            {descriptionBottom}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="AnimateMapOnboardModal__footer">
        {onSkip && (
          <ButtonNG
            className="AnimateMapOnboardModal__button-next"
            title={skipText}
            onClick={onSkip}
            isLink={true}
          >
            {skipText}
          </ButtonNG>
        )}
        {onNext && (
          <ButtonNG
            className="AnimateMapOnboardModal__button-next"
            title={nextText}
            onClick={onNext}
            variant="primary"
            disabled={disabledNext}
          >
            {nextText}
          </ButtonNG>
        )}
      </Modal.Footer>
    </Modal>
  );
};
