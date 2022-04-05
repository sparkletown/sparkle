import React from "react";

import { BlankPage } from "./BlankPage";

export const Forbidden: React.FC = () => (
  <BlankPage>
    <h1 data-bem="Forbidden__title" data-side="att">
      403 Not authorised
    </h1>
    <p data-bem="Forbidden__message" data-side="att">
      You don’t have permission to access this page.
    </p>
  </BlankPage>
);
