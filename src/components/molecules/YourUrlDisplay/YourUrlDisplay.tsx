import React from "react";

import "./YourUrlDisplay.scss";

export interface YourUrlDisplayProps {
  path?: string;
  slug?: string;
}

export const YourUrlDisplay: React.FC<YourUrlDisplayProps> = ({
  path,
  slug,
}) => (
  <span className="YourUrlDisplay">
    <span className="YourUrlDisplay__segment YourUrlDisplay__host">
      {window.location.protocol}
      {"//"}
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
  </span>
);
