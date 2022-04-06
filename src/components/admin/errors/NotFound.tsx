import React from "react";
import * as TW from "components/admin/errors/BlankPage.tailwind";

import { BlankPage } from "./BlankPage";

export const NotFound: React.FC = () => (
  <BlankPage>
    <h1 data-bem="NotFound__title" data-side="adm" className={TW.title}>
      404 Not found
    </h1>
    <p data-bem="NotFound__message" data-side="adm" className={TW.message}>
      The page your are looking for doesn&apos;t exist.
    </p>
  </BlankPage>
);
