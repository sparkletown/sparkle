import React from "react";

import {
  HOMEPAGE_URL,
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS_URL,
} from "settings";

import { getExtraLinkProps } from "utils/url";

import "./Footer.scss";

export const Footer = () => (
  <div className="footer-wrapper">
    <a href={TERMS_AND_CONDITIONS_URL} {...getExtraLinkProps(true)}>
      Terms of Use
    </a>

    <div>|</div>

    <a href={PRIVACY_POLICY} {...getExtraLinkProps(true)}>
      Privacy Policy
    </a>

    <div>|</div>

    <div>
      <a href={HOMEPAGE_URL} {...getExtraLinkProps(true)}>
        Made with{" "}
        <span role="img" aria-label="heart">
          ❤️
        </span>{" "}
        Powered by Sparkle{" "}
        <span role="img" aria-label="sparkle">
          ✨
        </span>
      </a>
    </div>
  </div>
);
