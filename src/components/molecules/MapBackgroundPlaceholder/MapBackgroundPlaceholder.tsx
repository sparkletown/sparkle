import React from "react";

import { CenterContent } from "components/atoms/CenterContent";

import "./MapBackgroundPlaceholder.scss";

export const MapBackgroundPlaceholder: React.FC = () => (
  <div className="MapBackgroundPlaceholder">
    <CenterContent>
      Pick a background for your map{"\n"}(2000x1200px recommended size)
    </CenterContent>
  </div>
);
