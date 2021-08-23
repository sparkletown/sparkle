import React from "react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./OnboardingModal.scss";

export interface OnboardingModalProps {
  className?: string;
  descriptionBottom?: string;
  descriptionTop?: string;
  disabledNext?: boolean;
  nextText?: string;
  onNext?: () => void;
  onSkip?: () => void;
  posterAlt?: string;
  posterSrc?: string;
  show?: boolean;
  skipText?: string;
  title?: string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
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

  const dialogClassName = classNames({
    "OnboardingModal OnboardingModal__dialog ": true,
    [className]: className,
  });

  return (
    <Modal
      centered
      dialogClassName={dialogClassName}
      show
      onHide={() =>
        console.warn(
          "Automatic hiding of this window by clicking outside is not allowed. Please use the skip button."
        )
      }
    >
      <Modal.Title className="OnboardingModal__title">{title}</Modal.Title>
      <Modal.Body className="OnboardingModal__body">
        {descriptionTop && (
          <div className="OnboardingModal__description OnboardingModal__description-top">
            {descriptionTop}
          </div>
        )}
        {posterSrc && (
          <img
            className="OnboardingModal__poster"
            alt={posterAlt}
            src={posterSrc}
          />
        )}
        <div className="OnboardingModal__children">{children}</div>
        {descriptionBottom && (
          <div className="OnboardingModal__description OnboardingModal__description-bottom">
            {descriptionBottom}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="OnboardingModal__footer">
        {onSkip && (
          <ButtonNG
            className="OnboardingModal__button-next"
            title={skipText}
            onClick={onSkip}
            isLink
          >
            {skipText}
          </ButtonNG>
        )}
        {onNext && (
          <ButtonNG
            className="OnboardingModal__button-next"
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
