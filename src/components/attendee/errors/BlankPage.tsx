import React from "react";

import CN from "./BlankPage.module.scss";

export const BlankPage: React.FC = ({ children }) => (
  <div data-bem="BlankPage" data-side="att" className={CN.container}>
    <div data-bem="BlankPage__contents" data-side="att" className={CN.contents}>
      {children}
    </div>
  </div>
);
