import React from "react";

import { HOMEPAGE_URL, TERMS_AND_CONDITIONS_URL } from "settings";

import "./Footer.scss";

export const Footer = () => (
  <div className="footer-wrapper">
    <a href={TERMS_AND_CONDITIONS_URL}>Terms of Use</a>

    <div>|</div>

    <div>
      <a className="powered-by" href={HOMEPAGE_URL}>
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
