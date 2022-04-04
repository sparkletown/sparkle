import React from "react";

import { BlankPage } from "./BlankPage";

export const NotFound: React.FC = () => {
  return (
    <BlankPage>
      <h1 data-bem="NotFound__title" data-side="att">
        404 Not found
      </h1>
      <p data-bem="NotFound__message" data-side="att">
        The page your are looking for doesn&apos;t exist.
      </p>
    </BlankPage>
  );
};
