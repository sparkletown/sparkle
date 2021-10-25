import React from "react";

import {
  EXTERNAL_SPARKLE_HOMEPAGE_URL,
  EXTERNAL_SPARKLE_PRIVACY_POLICY,
  EXTERNAL_SPARKLE_TOC_URL,
} from "settings";

import { getExtraLinkProps } from "utils/url";

import "./Footer.scss";

export const Footer = () => (
  <div className="footer-wrapper">
    <a href={EXTERNAL_SPARKLE_TOC_URL} {...getExtraLinkProps(true)}>
      Terms of Use
    </a>

    <div>|</div>

    <a href={EXTERNAL_SPARKLE_PRIVACY_POLICY} {...getExtraLinkProps(true)}>
      Privacy Policy
    </a>

    <div>|</div>

    <div>
      <a href={EXTERNAL_SPARKLE_HOMEPAGE_URL} {...getExtraLinkProps(true)}>
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
