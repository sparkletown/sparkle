import React from "react";

import { BlankPage } from "./BlankPage";

export const Unauthorized: React.FC = () => (
  <BlankPage>
    <h1 data-bem="Unauthorized__title" data-side="att">
      401 Not authenticated
    </h1>
    <p data-bem="Unauthorized__message" data-side="att">
      Please navigate to a URL that contains world and space slugs.
    </p>
  </BlankPage>
);
