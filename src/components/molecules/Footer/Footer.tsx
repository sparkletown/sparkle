import React from "react";

import {
  PRIVACY_POLICY,
  SPARKLE_FOOTER_URL,
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
      <a href={SPARKLE_FOOTER_URL} {...getExtraLinkProps(true)}>
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
