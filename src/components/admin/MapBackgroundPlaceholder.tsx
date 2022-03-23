import React from "react";
import { CenterContent } from "components/shared/CenterContent";

export const MapBackgroundPlaceholder: React.FC = () => (
  <div data-bem="MapBackgroundPlaceholder">
    <CenterContent>
      Pick a background for your map
      <br />
      (2000x1200px recommended size)
    </CenterContent>
  </div>
);
