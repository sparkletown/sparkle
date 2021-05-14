import React, { FC, useState, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { DEFAULT_MAP_BACKGROUND } from "settings";
import { WithId } from "utils/id";
import { PosterPageVenue } from "types/venues";
import classNames from "classnames";

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
  const [isCopied, setIsCopied] = useState(false);

  const handlerCopied = useCallback(() => {
    setIsCopied(true);
  }, []);

  const linkText = isCopied ? "Link Copied" : "Copy Link";

  const linkClasses = classNames("share-modal-container__link", {
    "share-modal-container__link--copied": isCopied,
  });

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?app_id=${process.env.REACT_APP_FACEBOOK_APP_ID}&u=${url}`;

  const twitterHref = `https://twitter.com/intent/tweet?text=${venue.chatTitle}&url=${url}`;

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
          <a
            href={facebookHref}
            target="_blank"
            rel="noreferrer"
            className="share-modal-container__link"
          >
            <FontAwesomeIcon icon={faFacebook} />
            <span className="share-modal-container__button-text">Facebook</span>
          </a>
          <a
            href={twitterHref}
            target="_blank"
            rel="noreferrer"
            className="share-modal-container__link"
          >
            <FontAwesomeIcon icon={faTwitter} />
            <span className="share-modal-container__button-text">Twitter</span>
          </a>
          <CopyToClipboard text={url}>
            <div className={linkClasses} onClick={handlerCopied}>
              {linkText}
            </div>
          </CopyToClipboard>
        </div>
      </Modal.Body>
    </Modal>
  );
};
