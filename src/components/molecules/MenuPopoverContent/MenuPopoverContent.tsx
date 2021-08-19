import React from "react";

import {
  HOMEPAGE_URL,
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS_URL,
} from "settings";

import { getExtraLinkProps } from "utils/url";

import "./MenuPopoverContent.scss";

export const MenuPopoverContent: React.FC = () => (
  <div className="MenuPopoverContent">
    <a
      href={TERMS_AND_CONDITIONS_URL}
      {...getExtraLinkProps(true)}
      className="MenuPopoverContent__link"
    >
      Terms of Use
    </a>

    <a
      href={PRIVACY_POLICY}
      {...getExtraLinkProps(true)}
      className="MenuPopoverContent__link"
    >
      Privacy Policy
    </a>

    <a
      href={HOMEPAGE_URL}
      {...getExtraLinkProps(true)}
      className="MenuPopoverContent__link"
    >
      SparkleVerse Homepage
    </a>
  </div>
);
