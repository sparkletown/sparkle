import React from "react";

import { HOMEPAGE_URL, TERMS_AND_CONDITIONS_URL } from "settings";

export const Footer = () => (
  <div className="footer-wrapper">
    <a className="terms-and-conditions" href={TERMS_AND_CONDITIONS_URL}>
      Terms & Conditions
    </a>
    <div className="footer-separator">|</div>
    <div>
      Made with{" "}
      <span role="img" aria-label="heart">
        ❤️
      </span>
      <a className="powered-by" href={HOMEPAGE_URL}>
        powered by Sparkle
      </a>
      <span role="img" aria-label="sparkle">
        ✨
      </span>
    </div>
    <div></div>
  </div>
);
