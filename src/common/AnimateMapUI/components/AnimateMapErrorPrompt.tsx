import React from "react";
import { getExtraLinkProps } from "common/AnimateMapCommon/utils";

import {
  EXTERNAL_WEBGL_CHECK_URL,
  STRING_SPACE,
} from "../../AnimateMapCommon/settings";

import "./AnimateMapErrorPrompt.scss";

interface AnimateMapErrorPromptProps {
  variant: "unsupported" | "unknown";
}

export const AnimateMapErrorPrompt: React.FC<AnimateMapErrorPromptProps> = ({
  variant,
  children,
}) => (
  <div className="AnimateMapErrorPrompt">
    <div className="AnimateMapErrorPrompt__contents">
      {variant === "unknown" ? (
        <>
          <p className="AnimateMapErrorPrompt__normal-text">
            We got bugs!
            <br />
            Try reloading the page. <br />
            If that fails, get a glass and a sheet of paper, catch the bug, and
            take it outside. <br />
            If the problem persists after refresh, take a screenshot and get in
            touch. <br />
            {children && <>The bug:</>}
          </p>

          {children && (
            <p className="AnimateMapErrorPrompt__error-message">{children}</p>
          )}
        </>
      ) : (
        <>
          <p className="AnimateMapErrorPrompt__normal-text">
            WebGL 2 appears to be disabled or not supported.
          </p>
          <p className="AnimateMapErrorPrompt__normal-text">
            Please check
            {STRING_SPACE}
            <a href={EXTERNAL_WEBGL_CHECK_URL} {...getExtraLinkProps(true)}>
              here
            </a>
            {STRING_SPACE}
            for further info.
          </p>
        </>
      )}
    </div>
  </div>
);
