import React, { FC } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { DEFAULT_MAP_BACKGROUND } from "settings";
import { WithId } from "utils/id";
import { PosterPageVenue } from "types/venues";
import classNames from "classnames";
import { LinkButton } from "components/atoms/LinkButton";
import { useShowHide } from "hooks/useShowHide";

import "./ShareModal.scss";

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  venue: WithId<PosterPageVenue>;
}

export const ShareModal: FC<ConfirmationModalProps> = ({
  show,
  onHide,
  venue,
}) => {
  const url = `${process.env.REACT_APP_CODE_CHECK_URL}in/${venue.id}`;
  const { isShown: isShowCopiedText, show: showCopiedText } = useShowHide();

  const linkText = isShowCopiedText ? "Link Copied" : "Copy Link";

  const linkClasses = classNames("share-modal-container__link", {
    "share-modal-container__link--copied": isShowCopiedText,
  });

  const textTitle = `Check out this OHBM Poster, ${venue.poster?.title} by ${venue.poster?.authorName} at ${url}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?app_id=${process.env.REACT_APP_FACEBOOK_APP_ID}&u=${url}&quote=${textTitle}&thumbnail=${venue.host?.icon}&picture=${venue.host?.icon}&hashtag=#OHBM2021`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${textTitle}&hashtags=OHBM2021`;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body>
        <div className="share-modal-header">
          <img
            width="100%"
            className="share-modal-header__background"
            src={venue.mapBackgroundImageUrl ?? DEFAULT_MAP_BACKGROUND}
            alt="map"
          />
          <div className="share-modal-header__logo"></div>
          <h3 className="share-modal-header__title">Room Title</h3>
          <span className="share-modal-header__url-text">{url}</span>
        </div>
        <div className="share-modal-container">
          <h3 className="share-modal-container__title">Share this room</h3>
          <LinkButton href={facebookHref}>
            <FontAwesomeIcon icon={faFacebook} />
            <span className="share-modal-container__button-text">Facebook</span>
          </LinkButton>
          <LinkButton href={twitterHref}>
            <FontAwesomeIcon icon={faTwitter} />
            <span className="share-modal-container__button-text">Twitter</span>
          </LinkButton>
          <CopyToClipboard text={url}>
            <div className={linkClasses} onClick={showCopiedText}>
              {linkText}
            </div>
          </CopyToClipboard>
        </div>
      </Modal.Body>
    </Modal>
  );
};
