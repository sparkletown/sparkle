import React from "react";

import { STRING_DOUBLE_SLASH } from "settings";

import "./YourUrlDisplay.scss";

export interface YourUrlDisplayProps {
  path?: string;
  slug?: string;
}

export const YourUrlDisplay: React.FC<YourUrlDisplayProps> = ({
  path,
  slug,
}) => (
  <p className="text-sm">
    <span className="YourUrlDisplay__segment YourUrlDisplay__host">
      {window.location.protocol}
      {STRING_DOUBLE_SLASH}
      {window.location.host}
    </span>
    {path && (
      <span className="YourUrlDisplay__segment YourUrlDisplay__path">
        {path}
      </span>
    )}
    {slug && (
      <span className="YourUrlDisplay__segment YourUrlDisplay__slug">
        /{slug}
      </span>
    )}
  </p>
);
