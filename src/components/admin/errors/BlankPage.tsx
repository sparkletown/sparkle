import React from "react";

import * as TW from "./BlankPage.tailwind";

export const BlankPage: React.FC = ({ children }) => (
  <div data-bem="BlankPage" data-side="adm" className={TW.container}>
    <div data-bem="BlankPage__contents" data-side="adm" className={TW.contents}>
      {children}
    </div>
  </div>
);
