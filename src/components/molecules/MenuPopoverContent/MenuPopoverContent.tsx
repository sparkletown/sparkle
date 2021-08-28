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
      className="MenuPopoverContent__link"
      {...getExtraLinkProps(true)}
    >
      Terms of Use
    </a>

    <a
      href={PRIVACY_POLICY}
      className="MenuPopoverContent__link"
      {...getExtraLinkProps(true)}
    >
      Privacy Policy
    </a>

    <a
      href={HOMEPAGE_URL}
      className="MenuPopoverContent__link"
      {...getExtraLinkProps(true)}
    >
      SparkleVerse Homepage
    </a>
  </div>
);
