import React, { FC, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";
import { getVenueFullLocation } from "utils/url";

import { useShowHide } from "hooks/useShowHide";

import { LinkButton } from "components/atoms/LinkButton";

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
  const url = getVenueFullLocation(venue.id);
  const { isShown: isShowCopiedText, show: showCopiedText } = useShowHide();

  const linkText = isShowCopiedText ? "Link Copied" : "Copy Link";

  const linkClasses = classNames("ShareModal__link", {
    "ShareModal__link--copied": isShowCopiedText,
  });

  const textTitle = `Check out this OHBM Poster, ${venue.poster?.title} by ${venue.poster?.authorName} at ${url}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?app_id=${process.env.REACT_APP_FACEBOOK_APP_ID}&u=${url}&quote=${textTitle}&thumbnail=${venue.host?.icon}&picture=${venue.host?.icon}&hashtag=#OHBM2021`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${textTitle}&hashtags=OHBM2021`;

  const linkButtonsComponent = useMemo(() => {
    const linkButtons = [
      {
        href: facebookHref,
        icon: faFacebook,
        title: "Facebook",
      },
      {
        href: twitterHref,
        icon: faTwitter,
        title: "Twitter",
      },
    ];

    return linkButtons.map((linkButton) => (
      <LinkButton href={linkButton.href} key={linkButton.title}>
        <FontAwesomeIcon icon={linkButton.icon} />
        <span className="ShareModal__button-text">{linkButton.title}</span>
      </LinkButton>
    ));
  }, [facebookHref, twitterHref]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body className="ShareModal">
        <div className="ShareModal__header">
          <img
            width="100%"
            className="ShareModal__background"
            src={venue.mapBackgroundImageUrl ?? DEFAULT_MAP_BACKGROUND}
            alt="map"
          />
          <div className="ShareModal__logo"></div>
          <h3 className="ShareModal__title">Room Title</h3>
          <span className="ShareModal__url-text">{url}</span>
        </div>
        <div className="ShareModal__container">
          <h3 className="ShareModal__container-title">Share this room</h3>
          {linkButtonsComponent}
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
