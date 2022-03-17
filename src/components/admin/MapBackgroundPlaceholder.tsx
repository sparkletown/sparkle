import React from "react";
import { CenterContent } from "components/admin/CenterContent";

export const MapBackgroundPlaceholder: React.FC = () => (
  <div className="MapBackgroundPlaceholder">
    <CenterContent>
      Pick a background for your map{"\n"}(2000x1200px recommended size)
    </CenterContent>
  </div>
);
